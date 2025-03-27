package pet.care.core.domain.entity;


import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;

@Data
@Entity
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)

public class Observation extends ResourceEntity {

    @Id
    @GeneratedValue(generator = "observation_id_generator")
    protected Long id;

    private String type;

    private String notes;


    @ManyToOne
    @JoinColumn(name = "professionalId", referencedColumnName = "id")
    private Profile professional;

    @ManyToOne
    @JoinColumn(name = "petId", referencedColumnName = "id")
    private Pet pet;

    @ManyToOne
    @JoinColumn(name = "appointmentId", referencedColumnName = "id")
    private Appointment appointment;

}
