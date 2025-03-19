package pet.care.core.service.module;

import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.City;
import pet.care.core.domain.entity.Organization;

@Service
public class OrganizationService extends BaseResourceService<Organization> {

    public OrganizationService(ApplicationContext ctx, JpaRepository<Organization, Long> repo) {
        super(ctx, Organization.class, repo);
    }
}
