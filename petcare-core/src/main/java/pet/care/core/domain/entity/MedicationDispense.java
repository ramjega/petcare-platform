package pet.care.core.domain.entity;


import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;

@Data
@Entity
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)


public class MedicationDispense extends ResourceEntity {

    @Id
    @GeneratedValue(generator = "medicineDispense_id_generator")
    protected Long id;

    private int quantity;

    private String description;

    @ManyToOne
    @JoinColumn(name = "customerId", referencedColumnName = "id")
    private Profile customer;

    @ManyToOne
    @JoinColumn(name = "petId", referencedColumnName = "id")
    private Pet pet;


    @ManyToOne
    @JoinColumn(name = "medicinalProductId", referencedColumnName = "id")
    private MedicinalProduct medicinalProduct;

    @ManyToOne
    @JoinColumn(name = "appointmentId", referencedColumnName = "id")
    private Appointment appointment;

}
