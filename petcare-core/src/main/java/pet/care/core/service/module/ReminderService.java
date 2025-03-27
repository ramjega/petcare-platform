package pet.care.core.service.module;

import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.Observation;
import pet.care.core.domain.entity.Reminder;

@Service
public class ReminderService extends BaseResourceService<Reminder> {
    public ReminderService(ApplicationContext ctx, JpaRepository<Reminder, Long> repo) {
        super(ctx, Reminder.class, repo);
    }
}
