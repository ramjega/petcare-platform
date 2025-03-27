package pet.care.core.repo.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import pet.care.core.domain.entity.MedicationDispense;

import java.util.List;
import java.util.Optional;

public interface MedicationDispenseRepo extends JpaRepository<MedicationDispense,Long> {
    List<MedicationDispense> findByAppointmentId(Long id);
    List<MedicationDispense> findByPetId(Long id);
}
