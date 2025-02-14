package pet.care.core.service.factory;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.City;
import pet.care.core.service.common.Result;
import pet.care.core.service.module.CityService;

@Service
public class CityFactory {
    private final CityService service;

    public CityFactory(ApplicationContext context) {
        this.service = context.getBean(CityService.class);
    }

    public Result<City> createCity(String name) {
        City city = new City();
        city.setName(name);
        return service.create(city);
    }
}


