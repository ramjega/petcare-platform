package pet.care.core.service.module;

import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.MedicationDispense;
import pet.care.core.service.common.Result;

@Service
public class MedicationDispenseService extends BaseResourceService<MedicationDispense> {


    public MedicationDispenseService(ApplicationContext ctx, JpaRepository<MedicationDispense, Long> repo) {
        super(ctx, MedicationDispense.class, repo);
    }

    @Override
    public Result<MedicationDispense> create(MedicationDispense value) {
        return super.create(value);
    }

    @Override
    public Result<MedicationDispense> update(MedicationDispense value) {
        return super.update(value);
    }
}
