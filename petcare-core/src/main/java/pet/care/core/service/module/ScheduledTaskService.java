package pet.care.core.service.module;

import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.ScheduledTask;

@Service
public class ScheduledTaskService extends BaseResourceService<ScheduledTask> {

    public ScheduledTaskService(ApplicationContext ctx, JpaRepository<ScheduledTask, Long> repo) {
        super(ctx, ScheduledTask.class, repo);
    }
}
