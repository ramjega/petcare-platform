package pet.care.core.repo.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.core.domain.entity.ScheduledTask;
import pet.care.core.domain.type.SchedulePhase;
import pet.care.core.domain.type.ScheduleStatus;

import java.util.List;

@Repository
public interface ScheduledTaskRepo extends JpaRepository<ScheduledTask, Long> {

    List<ScheduledTask> findTop10ByScheduleStatusAndSchedulePhaseAndNextScheduleTimeLessThanEqual(
            ScheduleStatus scheduleStatus,
            SchedulePhase schedulePhase,
            Long nextScheduleTime
    );
}