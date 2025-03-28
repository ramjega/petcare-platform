package pet.care.core.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.joda.time.LocalDate;
import pet.care.core.domain.type.Gender;
import pet.care.core.domain.type.PetType;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@Entity
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Table(indexes = {
})
public class GrowthData extends ResourceEntity {

    @Id
    @GeneratedValue(generator = "growth_data_id_generator")
    protected Long id;

    private Double weight;

    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "petId", referencedColumnName = "id")
    private Pet pet;
}
