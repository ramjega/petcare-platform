package pet.care.core.service.module;

import pet.care.core.domain.entity.ScheduledTask;
import pet.care.core.domain.entity.ScheduledTaskOutput;

public interface ScheduledTaskHandler {
    ScheduledTaskOutput execute(ScheduledTask task);
}
