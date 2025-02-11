package pet.care.core.service.module;

import org.dmfs.rfc5545.DateTime;
import org.dmfs.rfc5545.Duration;
import org.dmfs.rfc5545.recur.InvalidRecurrenceRuleException;
import org.dmfs.rfc5545.recur.RecurrenceRuleIterator;
import org.jooq.lambda.Seq;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import pet.care.core.domain.entity.Schedule;
import pet.care.core.domain.entity.ScheduledTask;
import pet.care.core.domain.entity.ScheduledTaskOutput;
import pet.care.core.domain.entity.Session;
import pet.care.core.domain.type.ScheduleCycle;
import pet.care.core.service.common.Result;
import pet.care.core.service.util.DateTimeFormats;
import pet.care.core.service.util.ScheduledTaskTimeUtils;
import pet.care.core.service.util.TimeUtils;

import java.util.*;

@Component
public class SessionGenerationHandler implements ScheduledTaskHandler {
    private static final Logger logger = LoggerFactory.getLogger("scheduler");
    private static final int taskRangeInDays = 1;
    public static final int taskSlidingRangeValue = 20;

    private final ScheduleService scheduleService;
    private final SessionService sessionService;

    public SessionGenerationHandler(ApplicationContext ctx) {
        this.scheduleService = ctx.getBean(ScheduleService.class);
        this.sessionService = ctx.getBean(SessionService.class);
    }

    @Override
    public ScheduledTaskOutput execute(ScheduledTask scheduledTask) {

        try {
            Optional<Schedule> scheduleFound = Optional.of(Long.parseLong(scheduledTask.getData().get("scheduleId"))).flatMap(scheduleService::findById);

            if (scheduleFound.isPresent()) {
                Schedule schedule = scheduleFound.get();

                String expression = schedule.getRecurringRule();

                DateTime currentBatchStartTime = new DateTime(schedule.getNextGenerationDateTime());

                long endOfNextRange = Math.max(
                        TimeUtils.startTimeOfUtcTodayPlusDays(1),
                        new DateTime(TimeUtils.startTimeOfUtcGivenTime(currentBatchStartTime.getTimestamp()))
                                .addDuration(new Duration(1, taskRangeInDays, 0, 0, 0))
                                .getTimestamp()
                );

                if (taskRangeInDays == 1) {
                    if (endOfNextRange > TimeUtils.startTimeOfUtcTodayPlusDays(taskSlidingRangeValue + 1)) {
                        logger.info("More than enough session generated for schedule [{}] in given sliding range, skipping session generation", schedule.getId());
                        return new ScheduledTaskOutput(ScheduledTaskOutput.Status.task_success_next);
                    }
                }

                Map<String, String> rRuleMap = ScheduledTaskTimeUtils.getRRuleMap(expression);

                rRuleMap.put("DTSTART", DateTimeFormats.convertUtcLongToUtcString(currentBatchStartTime.getTimestamp()));

                String filterExpression = Seq.seq(rRuleMap.entrySet()).map(kv -> kv.getKey() + "=" + kv.getValue()).toString(";");

                RecurrenceRuleIterator filterRuleIterator = ScheduledTaskTimeUtils.getRRuleIterator(filterExpression);

                List<DateTime> innerDateRange = new ArrayList<>();
                List<DateTime> outerDateRange = new ArrayList<>();

                while (filterRuleIterator.hasNext()) {
                    DateTime dateTime = filterRuleIterator.nextDateTime();

                    if (dateTime.getTimestamp() < endOfNextRange) {
                        innerDateRange.add(dateTime);
                    } else {
                        outerDateRange.add(dateTime);
                        break;
                    }
                }

                Optional<DateTime> nextBatchStartDate = Seq.seq(outerDateRange).findFirst();

                Map<Long, Session> sessions = new HashMap<>();

                logger.debug("Generating sessions for schedule [{}] from [{}]", schedule.getId(), DateTimeFormats.convertUtcLongToUtcString(currentBatchStartTime.getTimestamp()));

                for (DateTime dateTime : innerDateRange) {

                    Session session = new Session();
                    session.setStart(dateTime.getTimestamp());
                    session.setHospital(schedule.getHospital());
                    session.setMaxAllowed(schedule.getMaxAllowed());
                    session.setSchedule(schedule);
                    session.setProfessional(schedule.getProfessional());

                    Result<Session> result = sessionService.create(session);

                    if (result.code().isSuccess()) {
                        sessions.put(result.value().getId(), result.value());
                    } else {
                        logger.error("Failed to generate session for schedule [{}], cause [{}]", schedule.getId(), result.code().error());
                    }
                }

                if (nextBatchStartDate.isPresent()) {
                    schedule.setNextGenerationDateTime(nextBatchStartDate.get().getTimestamp());
                    schedule.setScheduleCycle(ScheduleCycle.active);
                    scheduleService.update(schedule);
                    logger.debug("Task success next: Generated [{}] sessions", sessions.size());
                    return new ScheduledTaskOutput(ScheduledTaskOutput.Status.task_success_next);
                } else {
                    schedule.setScheduleCycle(ScheduleCycle.completed);
                    scheduleService.update(schedule);
                    logger.debug("Task success end: Generated [{}] sessions", sessions.size());
                    return new ScheduledTaskOutput(ScheduledTaskOutput.Status.task_success_end);
                }

            } else {
                logger.error("Task permanent failure: Schedule data is missing, suspended");
                return new ScheduledTaskOutput(ScheduledTaskOutput.Status.task_failure_end);
            }
        } catch (InvalidRecurrenceRuleException e) {
            logger.error("Task permanent failure: Task failed due to rrule error [{}]", e);
            return new ScheduledTaskOutput(ScheduledTaskOutput.Status.task_failure_end);
        }
    }
}
