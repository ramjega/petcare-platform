package pet.care.core.service.endpoint.rest;

import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.core.domain.entity.MedicinalProduct;
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

    @GetMapping(value = "/medicinalProduct/get")
    public ResponseEntity get() {
        ListHolder<MedicinalProduct> holder = new ListHolder<>(service.query());
        return response(Result.of(holder));
    }

    @PostMapping(value = "/medicinalProduct/create")
    public ResponseEntity register(@RequestBody MedicinalProduct value) {
        Result<MedicinalProduct> result = service.create(value);
        return response(result);
    }

    @PatchMapping(value = "/medicinalProduct/patch/{id}")
    public ResponseEntity update(@PathVariable Long id, @RequestBody List<ResourcePatch> patches) {
        Result<MedicinalProduct> result = service.patch(id, patches);
        return response(result);
    }

    @DeleteMapping(value = "/medicinalProduct/delete/{id}")
    public ResponseEntity delete(@PathVariable Long id) {
        Result<MedicinalProduct> result = service.delete(id);
        if (result.code().isSuccess()) {
            return response(Result.of("Deleted Successfully"));
        } else {
            return response(result);
        }
    }
}
