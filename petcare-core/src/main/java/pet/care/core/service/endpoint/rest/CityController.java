package pet.care.core.service.endpoint.rest;

import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.core.domain.entity.City;
import pet.care.core.domain.entity.Pet;
import pet.care.core.service.common.Result;
import pet.care.core.service.module.CityService;

import java.util.List;
import java.util.Optional;

import static pet.care.core.service.common.Converter.response;

@RestController
@CrossOrigin
public class CityController {

    private final CityService service;

    public CityController(ApplicationContext context) {
        this.service = context.getBean(CityService.class);
    }

    @GetMapping(value = "/api/cities")
    public ResponseEntity<List<City>> get() {
        return ResponseEntity.ok(service.query());
    }

    @PostMapping(value = "/api/city/create")
    public ResponseEntity register(@RequestBody City value) {
        Result<City> result = service.create(value);
        return response(result);
    }

    @PutMapping(value = "/api/city/update")
    public ResponseEntity update(@RequestBody City value) {
        Result<City> result = service.update(value);
        return response(result);
    }

    @DeleteMapping(value = "/api/city/delete/{id}")
    public ResponseEntity delete(@PathVariable Long id) {
        return response(service.delete(id));
    }
}
