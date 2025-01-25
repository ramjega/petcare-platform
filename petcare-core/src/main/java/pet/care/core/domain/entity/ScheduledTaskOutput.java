package pet.care.core.domain.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Embeddable;

@Data
@ToString(callSuper = true)
@NoArgsConstructor
@Embeddable
public class ScheduledTaskOutput {

    public enum Status {
        task_success_next,
        task_success_end,
        task_failure_retry,
        task_failure_end,
    }

    public ScheduledTaskOutput(Status status) {
        this.status = status;
    }

    private Status status = Status.task_success_next;
}
