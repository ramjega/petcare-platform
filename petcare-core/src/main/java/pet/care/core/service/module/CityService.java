package pet.care.core.service.module;

import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.City;
import pet.care.core.domain.entity.MedicationDispense;
import pet.care.core.service.common.Result;

@Service
public class CityService extends BaseResourceService<City> {

    public CityService(ApplicationContext ctx, JpaRepository<City, Long> repo) {
        super(ctx, City.class, repo);
    }
}
