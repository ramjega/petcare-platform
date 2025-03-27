package pet.care.core.repo.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import pet.care.core.domain.entity.Observation;
import pet.care.core.domain.entity.Reminder;

import java.util.List;

public interface ReminderRepo extends JpaRepository<Reminder,Long> {
    List<Reminder> findByAppointmentId(Long id);
    List<Reminder> findByPetId(Long id);
}
