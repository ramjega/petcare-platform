package pet.care.core.repo.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import pet.care.core.domain.entity.ActivityLog;

import java.util.List;

public interface ActivityLogRepo extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByPetId(Long id);
}
