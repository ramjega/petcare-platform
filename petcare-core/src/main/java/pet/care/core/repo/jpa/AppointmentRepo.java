package pet.care.core.repo.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.core.domain.entity.Appointment;
import pet.care.core.domain.entity.Observation;
import pet.care.core.domain.type.AppointmentStatus;

import java.util.List;

@Repository
public interface AppointmentRepo extends JpaRepository<Appointment, Long> {
    long countAppointmentByStatusIsNotAndSessionId(AppointmentStatus status, Long id);

    List<Appointment> findByCustomerId(Long id);
    List<Appointment> findBySessionId(Long id);
    List<Appointment> findBySessionIdAndStatus(Long id, AppointmentStatus status);
    List<Appointment> findByPetId(Long id);
}