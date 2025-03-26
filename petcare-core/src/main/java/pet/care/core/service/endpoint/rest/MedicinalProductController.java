package pet.care.core.service.endpoint.rest;

import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.core.domain.entity.City;
import pet.care.core.domain.entity.MedicinalProduct;
import pet.care.core.domain.entity.Organization;
import pet.care.core.domain.wrapper.ListHolder;
import pet.care.core.service.common.ResourcePatch;
import pet.care.core.service.common.Result;
import pet.care.core.service.module.MedicinalProductService;

import java.util.List;

import static pet.care.core.service.common.Converter.response;

@RestController
@CrossOrigin
public class MedicinalProductController {

    private final MedicinalProductService service;

    public MedicinalProductController(ApplicationContext context) {
        this.service = context.getBean(MedicinalProductService.class);
    }

    @GetMapping(value = "/api/medicinalProducts")
    public ResponseEntity<List<MedicinalProduct>> get() {
        return ResponseEntity.ok(service.query());
    }

    @PostMapping(value = "/api/medicinalProduct/create")
    public ResponseEntity register(@RequestBody MedicinalProduct value) {
        Result<MedicinalProduct> result = service.create(value);
        return response(result);
    }


    @PutMapping(value = "/api/medicinalProduct/update")
    public ResponseEntity update(@RequestBody MedicinalProduct value) {
        Result<MedicinalProduct> result = service.update(value);
        return response(result);
    }

    @DeleteMapping(value = "/api/medicinalProduct/delete/{id}")
    public ResponseEntity delete(@PathVariable Long id) {
        return response(service.delete(id));
    }
}
