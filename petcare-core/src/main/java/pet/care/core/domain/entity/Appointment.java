package pet.care.core.domain.entity;


import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import pet.care.core.domain.type.AppointmentStatus;

import javax.persistence.*;

import static pet.care.core.domain.type.AppointmentStatus.booked;

@Data
@Entity
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Table(indexes = {
        @Index(columnList = "status")
})

public class Appointment extends ResourceEntity {
    @Id
    @GeneratedValue(generator = "appointment_id_generator")
    protected Long id;

    private Long token;

    private AppointmentStatus status = booked;

    @ManyToOne
    @JoinColumn(name = "petId", referencedColumnName = "id")
    private Pet pet;

    @ManyToOne
    @JoinColumn(name = "customerId", referencedColumnName = "id")
    private Profile customer;

    @ManyToOne
    @JoinColumn(name = "sessionId", referencedColumnName = "id")
    private Session session;
}
