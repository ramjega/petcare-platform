package pet.care.core.service.module;

import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.ActivityLog;

@Service
public class ActivityLogService extends BaseResourceService<ActivityLog> {

    public ActivityLogService(ApplicationContext ctx, JpaRepository<ActivityLog, Long> repo) {
        super(ctx, ActivityLog.class, repo);
    }
}
