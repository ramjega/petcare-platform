package pet.care.core.service.factory;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.City;
import pet.care.core.domain.entity.Organization;
import pet.care.core.service.common.Result;
import pet.care.core.service.module.OrganizationService;

@Service
public class OrganizationFactory {
    private final OrganizationService service;

    public OrganizationFactory(ApplicationContext context) {
        this.service = context.getBean(OrganizationService.class);
    }

    public Result<Organization> createOrganization(String name, City city) {
        Organization organization = new Organization();
        organization.setName(name);
        organization.setCity(city);

        return service.create(organization);
    }
}


