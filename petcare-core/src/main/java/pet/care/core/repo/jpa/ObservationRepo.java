package pet.care.core.repo.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import pet.care.core.domain.entity.MedicationDispense;
import pet.care.core.domain.entity.Observation;

import java.util.List;

public interface ObservationRepo extends JpaRepository<Observation,Long> {
    List<Observation> findByAppointmentId(Long id);
    List<Observation> findByPetId(Long id);
}
