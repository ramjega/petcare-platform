package pet.care.core.service.module;

import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.GrowthData;

@Service
public class GrowthDataService extends BaseResourceService<GrowthData> {

    public GrowthDataService(ApplicationContext ctx, JpaRepository<GrowthData, Long> repo) {
        super(ctx, GrowthData.class, repo);
    }
}
