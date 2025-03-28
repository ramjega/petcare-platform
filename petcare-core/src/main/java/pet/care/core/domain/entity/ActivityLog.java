package pet.care.core.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.joda.time.LocalDate;

import javax.persistence.*;

@Data
@Entity
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Table(indexes = {
})
public class ActivityLog extends ResourceEntity {

    @Id
    @GeneratedValue(generator = "activity_log_id_generator")
    protected Long id;

    private LocalDate date;

    private Integer exerciseDuration;
    private Double walkDistance;
    private Double sleepDuration;

    @ManyToOne
    @JoinColumn(name = "petId", referencedColumnName = "id")
    private Pet pet;
}
