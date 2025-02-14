package pet.care.core.service.module;

import lombok.extern.slf4j.Slf4j;
import org.dmfs.rfc5545.DateTime;
import org.dmfs.rfc5545.Duration;
import org.dmfs.rfc5545.recur.InvalidRecurrenceRuleException;
import org.dmfs.rfc5545.recur.RecurrenceRuleIterator;
import org.jooq.lambda.Seq;
import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.Schedule;
import pet.care.core.domain.entity.ScheduledTask;
import pet.care.core.domain.entity.Session;
import pet.care.core.domain.type.ScheduleCycle;
import pet.care.core.domain.type.ScheduleStatus;
import pet.care.core.domain.type.ScheduleStatusValue;
import pet.care.core.service.common.Result;
import pet.care.core.service.endpoint.auth.SecurityHolder;
import pet.care.core.service.util.DateTimeFormats;
import pet.care.core.service.util.ScheduledTaskTimeUtils;
import pet.care.core.service.util.TimeUtils;

import java.util.*;
import java.util.stream.Collectors;

import static pet.care.core.service.common.StatusCode.sc;
import static pet.care.core.service.common.TxStatusCodes.SC_VALIDATION_FAILED;
import static pet.care.core.service.module.SessionGenerationHandler.taskSlidingRangeValue;

@Slf4j
@Service
public class ScheduleService extends BaseResourceService<Schedule> {
    private static final String taskExpressionValue = "DTSTART=$DTSTART;FREQ=DAILY;INTERVAL=1";
    private static final String taskRetryExpressionValue = "DTSTART=$DTSTART;FREQ=HOURLY;INTERVAL=1;COUNT=3";
    private static final int taskRetryMaxLimitValue = 3;

    private final SessionService sessionService;
    private final ScheduledTaskService scheduledTaskService;

    public ScheduleService(ApplicationContext ctx, JpaRepository<Schedule, Long> repo) {
        super(ctx, Schedule.class, repo);
        this.sessionService = ctx.getBean(SessionService.class);
        this.scheduledTaskService = ctx.getBean(ScheduledTaskService.class);
    }

    @Override
    public Result<Schedule> create(Schedule value) {

        if (value.getRecurringRule() == null || value.getMaxAllowed() == null || value.getOrganization() == null) {
            return Result.of(sc(SC_VALIDATION_FAILED, "Missing required fields! - recurringRule | maxAllowed | organization"));
        }

        if (value.getProfessional() == null) {
            value.setProfessional(SecurityHolder.getProfile());
        }

        Result<Schedule> result = super.create(value);

        if (result.code().isSuccess() && value.getStatus() == ScheduleStatusValue.active) {
            return generateTask(value);
        }

        return result;
    }

    @Override
    public Result<Schedule> update(Schedule value) {
        if (value.getRecurringRule() == null || value.getMaxAllowed() == null) {
            return Result.of(sc(SC_VALIDATION_FAILED, "Missing required fields! - recurringRule | maxAllowed"));
        }

        Result<Schedule> result = super.update(value);

        if (result.code().isSuccess() && value.getStatus() == ScheduleStatusValue.active) {
            return generateTask(value);
        }

        return result;
    }

    private Result<Schedule> generateTask(Schedule schedule) {
        log.debug("Generating sessions for schedule [{}]", schedule.getId());

        try {

            if (schedule.getRecurringRule() != null) {

                RecurrenceRuleIterator ruleIterator = ScheduledTaskTimeUtils.getRRuleIterator(
                        schedule.getRecurringRule()
                );

                DateTime startOfSchedule = null;
                DateTime endOfOneYearRange = null;

                List<Session> sessions = new ArrayList<>();

                while (ruleIterator.hasNext()) {
                    DateTime dateTime = ruleIterator.nextDateTime();

                    if (startOfSchedule == null) {
                        startOfSchedule = dateTime;
                        endOfOneYearRange = dateTime.addDuration(new Duration(1, 365, 0, 0, 0));
                    }

                    if (dateTime.getTimestamp() > endOfOneYearRange.getTimestamp()) {
                        break;
                    }

                    Session session = new Session();
                    session.setStart(dateTime.getTimestamp());
                    session.setOrganization(schedule.getOrganization());
                    session.setMaxAllowed(schedule.getMaxAllowed());
                    session.setSchedule(schedule);
                    session.setProfessional(schedule.getProfessional());

                    sessions.add(session);
                }

                if (sessions.size() > 0) {

                    DateTime startDate = Optional.of(startOfSchedule).orElse(new DateTime(TimeUtils.currentUtcTime()));

                    //filter first batch of tasks

                    Long nextBatchDivider = startDate.addDuration(new Duration(1, taskSlidingRangeValue, 0, 0, 0)).getTimestamp();

                    Long nextBatchStartDate = Seq.seq(sessions).sorted(Session::getStart).filter(t -> t.getStart() >= nextBatchDivider).map(Session::getStart).findFirst().orElse(0L);

                    sessions = Seq.seq(sessions).sorted(Session::getStart).filter(t -> t.getStart() < nextBatchDivider).collect(Collectors.toList());

                    for (Session session : sessions) {
                        Result<Session> result = sessionService.create(session);

                        if (result.code().isFailure()) {
                            log.error("Session creation failure for schedule [{}], cause [{}]", schedule.getId(), result.code().error());
                        }
                    }

                    log.debug("Generated first batch of sessions, first batch total [{}] for schedule [{}]", sessions.size(), schedule.getId());

                    if (nextBatchStartDate > 0) {
                        //for later tasks initiate scheduled task

                        ScheduledTask scheduledTask = new ScheduledTask();

                        Map<String, String> data = new HashMap<>();

                        data.put("scheduleId", String.valueOf(schedule.getId()));

                        scheduledTask.setData(data);
                        scheduledTask.setHandler(SessionGenerationHandler.class.getName());

                        long taskStartTime = TimeUtils.currentUtcTime();

                        scheduledTask.setScheduleExpression(taskExpressionValue.replaceFirst("\\$DTSTART", DateTimeFormats.convertUtcLongToUtcString(taskStartTime)));
                        scheduledTask.setRetryExpression(taskRetryExpressionValue.replaceFirst("\\$DTSTART", DateTimeFormats.convertUtcLongToUtcString(taskStartTime)));
                        scheduledTask.setMaxRetryLimit(taskRetryMaxLimitValue);

                        scheduledTask.moveToNextState(ScheduleStatus.active, Optional.empty());

                        scheduledTaskService.create(scheduledTask).unwrap();

                        schedule.setScheduledTask(scheduledTask);
                        schedule.setNextGenerationDateTime(nextBatchStartDate);
                        schedule.setScheduleCycle(ScheduleCycle.active);

                        repo.save(schedule);
                        log.debug("Created scheduled task [{}] for remaining sessions", scheduledTask.getId());
                        return Result.of(schedule);
                    } else {
                        schedule.setScheduleCycle(ScheduleCycle.completed);
                        repo.save(schedule);
                        log.debug("No need to create scheduled task for remaining sessions, first batch ends before next schedule session start time");
                        return Result.of(schedule);
                    }
                } else {
                    log.error("Given rrule [{}] has zero dates", schedule.getRecurringRule());
                    return Result.of(sc(SC_VALIDATION_FAILED, "Given rrule has zero dates!"));
                }
            } else {
                return Result.of(sc(SC_VALIDATION_FAILED, "Missing required field Schedule.recurringRule !"));
            }
        } catch (InvalidRecurrenceRuleException e) {
            log.error("Error occurred while generating sessions", e);
            return Result.of(sc(SC_VALIDATION_FAILED, "Error occurred while generating sessions [" + e.getMessage() + "]"));
        }
    }
}
