package pet.care.core.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import pet.care.core.domain.type.ScheduleCycle;
import pet.care.core.domain.type.ScheduleStatusValue;

import javax.persistence.*;

@Data
@Entity
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Table(indexes = {
        @Index(columnList = "status")
})
public class Schedule extends ResourceEntity {

    @Id
    @GeneratedValue(generator = "schedule_config_id_generator")
    protected Long id;

    private Long maxAllowed;

    private ScheduleStatusValue status = ScheduleStatusValue.draft;

    private String recurringRule;

    private Long nextGenerationDateTime = 0L;

    private ScheduleCycle scheduleCycle = ScheduleCycle.initial;

    @OneToOne
    @JoinColumn(name = "scheduledTaskId", referencedColumnName = "id")
    private ScheduledTask scheduledTask;

    @ManyToOne
    @JoinColumn(name = "professionalId", referencedColumnName = "id")
    private Profile professional;

    private String hospital; // optional for veterinarians usage
}

