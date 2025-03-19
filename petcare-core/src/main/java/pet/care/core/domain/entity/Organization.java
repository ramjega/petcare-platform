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
        @Index(columnList = "name"),
})
public class Organization extends ResourceEntity {

    @Id
    @GeneratedValue(generator = "organization_id_generator")
    protected Long id;

    private String name;

    private String email;

    private String address;

    @ManyToOne
    @JoinColumn(name = "cityId", referencedColumnName = "id")
    private City city;
}

