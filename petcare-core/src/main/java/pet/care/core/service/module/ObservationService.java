package pet.care.core.service.module;

import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.MedicationDispense;
import pet.care.core.domain.entity.Observation;
import pet.care.core.service.common.Result;

@Service
public class ObservationService extends BaseResourceService<Observation> {

    public ObservationService(ApplicationContext ctx, JpaRepository<Observation, Long> repo) {
        super(ctx, Observation.class, repo);
    }
}
