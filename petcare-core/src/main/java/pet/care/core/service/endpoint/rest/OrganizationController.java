package pet.care.core.service.endpoint.rest;

import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.core.domain.entity.Organization;
import pet.care.core.service.common.Result;
import pet.care.core.service.module.OrganizationService;

import java.util.List;

import static pet.care.core.service.common.Converter.response;

@RestController
@CrossOrigin
public class OrganizationController {

    private final OrganizationService service;

    public OrganizationController(ApplicationContext context) {
        this.service = context.getBean(OrganizationService.class);
    }

    @GetMapping(value = "/api/organizations")
    public ResponseEntity<List<Organization>> get() {
        return ResponseEntity.ok(service.query());
    }

    @PostMapping(value = "/api/organization/create")
    public ResponseEntity register(@RequestBody Organization value) {
        Result<Organization> result = service.create(value);
        return response(result);
    }

    @PatchMapping(value = "/api/organization/update")
    public ResponseEntity update(@RequestBody Organization value) {
        Result<Organization> result = service.update(value);
        return response(result);
    }
}
