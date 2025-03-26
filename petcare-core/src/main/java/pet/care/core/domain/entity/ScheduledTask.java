package pet.care.core.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.leangen.graphql.annotations.GraphQLIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.jooq.lambda.Seq;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pet.care.core.domain.type.SchedulePhase;
import pet.care.core.domain.type.ScheduleStatus;
import pet.care.core.service.util.DateTimeFormats;
import pet.care.core.service.util.TimeUtils;

import javax.persistence.*;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static pet.care.core.domain.type.SchedulePhase.*;
import static pet.care.core.domain.type.ScheduleStatus.*;
import static pet.care.core.service.util.ScheduledTaskTimeUtils.findNext;


@Data
@Entity
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Table(indexes = {
        @Index(columnList = "handler"),
        @Index(columnList = "scheduleStatus"),
        @Index(columnList = "schedulePhase"),
        @Index(columnList = "nextScheduleTime")
})
public class ScheduledTask extends ResourceEntity {

    private static final Logger logger = LoggerFactory.getLogger(ScheduledTask.class);

    private static final Pattern PATTERN_DT_START = Pattern.compile("DTSTART=(\\w+);(.*)");

    @Id
    @GeneratedValue(generator = "schedule_id_generator")
    private Long id;

    private String scheduleExpression;

    private String retryExpression;

    private ScheduleStatus scheduleStatus = ScheduleStatus.initial;

    private SchedulePhase schedulePhase = SchedulePhase.fresh;

    @Embedded
    private ScheduledTaskOutput lastOutput;

    private Long lastScheduleTime;

    private Long lastCycleTime;

    private Long nextScheduleTime;

    private Long lastExecutionTime;

    private Integer executionCount = 0;

    private Integer cycleCount = 0;

    private Integer successCount = 0;

    private Integer failureCount = 0;

    private Integer retryCount = 0;

    private Integer suspensionCount = 0;

    private Integer resumptionCount = 0;

    private Integer maxRetryLimit = 0;

    private String handler;

    private String resultCode;

    @ElementCollection(fetch = FetchType.EAGER)
    private Map<String, String> data = Collections.emptyMap();

    @JsonIgnore
    @GraphQLIgnore
    public synchronized void moveToNextState(ScheduleStatus newStatus, Optional<ScheduledTaskOutput> output) {

        switch (scheduleStatus) {
            case initial:
                if (newStatus == active) {
                    moveToNextSchedule();
                } else if (newStatus == suspended) {
                    suspensionCount = suspensionCount + 1;

                    scheduleStatus = suspended;
                    schedulePhase = paused;

                } else if (newStatus == terminated) {
                    scheduleStatus = terminated;
                    schedulePhase = finished;
                }
                break;
            case active:
                if (newStatus == suspended) {
                    suspensionCount = suspensionCount + 1;

                    scheduleStatus = suspended;
                    schedulePhase = paused;

                } else if (newStatus == terminated) {


                    scheduleStatus = terminated;
                    schedulePhase = finished;

                } else if (newStatus == active) {

                    if (output.isPresent()) {
                        executionCount = executionCount + 1;
                        lastScheduleTime = nextScheduleTime;
                        lastExecutionTime = TimeUtils.currentUtcTime();

                        if (schedulePhase == recurring) {
                            cycleCount = cycleCount + 1;
                            lastCycleTime = lastScheduleTime;
                        }

                        lastOutput = output.get();

                        switch (lastOutput.getStatus()) {
                            case task_success_next:

                                successCount = successCount + 1;

                                moveToNextSchedule();

                                break;

                            case task_success_end:

                                successCount = successCount + 1;

                                scheduleStatus = active;
                                schedulePhase = finished;

                                break;
                            case task_failure_retry:


                                failureCount = failureCount + 1;

                                moveToNextRetry();
                                break;
                            case task_failure_end:

                                failureCount = failureCount + 1;

                                scheduleStatus = active;
                                schedulePhase = finished;
                                break;
                        }
                    }
                }
                break;
            case suspended:
                if (newStatus == terminated) {

                    scheduleStatus = terminated;
                    schedulePhase = finished;

                } else if (newStatus == active) {

                    resumptionCount = resumptionCount + 1;

                    moveToNextSchedule();
                }
                break;
            case terminated:
                //do nothing
                break;
        }
    }

    private void moveToNextRetry() {

        if (retryExpression != null) {

            Matcher matcher = PATTERN_DT_START.matcher(retryExpression);

            if (matcher.matches()) {
                Long retryStartTime = 0L;

                if (lastCycleTime != null) {
                    retryStartTime = lastCycleTime;
                } else {
                    retryStartTime = TimeUtils.currentUtcTime();
                }

                retryExpression = "DTSTART=" + DateTimeFormats.convertUtcLongToUtcString(retryStartTime) + ";" + matcher.group(2);

                long currentUtcTime = TimeUtils.currentUtcTime();

                Optional<Long> nextDate = findNext(
                        scheduleExpression, currentUtcTime
                );

                Optional<Long> nextRetryDate = findNext(
                        retryExpression, currentUtcTime
                );

                if (retryCount + 1 <= maxRetryLimit &&
                        nextRetryDate.isPresent() &&
                        Seq.seq(nextDate).map(dt -> dt > nextRetryDate.get()).findFirst().orElse(true)) {
                    retryCount = retryCount + 1;

                    scheduleStatus = active;
                    schedulePhase = recurring_retry;

                    nextScheduleTime = nextRetryDate.get();
                } else {
                    retryCount = 0;
                    moveToNextSchedule();
                }
            } else {
                moveToNextSchedule();
            }
        } else {
            moveToNextSchedule();
        }
    }

    private void moveToNextSchedule() {
        Optional<Long> nextDate = findNext(
                scheduleExpression,
                TimeUtils.currentUtcTime()
        );

        if (nextDate.isPresent()) {

            scheduleStatus = active;
            schedulePhase = recurring;

            nextScheduleTime = nextDate.get();
        } else {
            scheduleStatus = active;
            schedulePhase = finished;
        }
    }

}
