package pet.care.core.service.endpoint.rest;

import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.core.domain.entity.MedicationDispense;
import pet.care.core.domain.entity.Organization;
import pet.care.core.domain.wrapper.ListHolder;
import pet.care.core.repo.jpa.MedicationDispenseRepo;
import pet.care.core.service.common.ResourcePatch;
import pet.care.core.service.common.Result;
import pet.care.core.service.endpoint.auth.SecurityHolder;
import pet.care.core.service.module.MedicationDispenseService;

import java.util.List;

import static pet.care.core.service.common.Converter.response;


@RestController
@CrossOrigin
public class MedicationDispenseController {

    private final MedicationDispenseService service;
    private final MedicationDispenseRepo repo;

    public MedicationDispenseController(ApplicationContext context) {
        this.service = context.getBean(MedicationDispenseService.class);
        this.repo = context.getBean(MedicationDispenseRepo.class);
    }

    @GetMapping(value = "/medicationDispense/get/pet/{id}")
    public ResponseEntity getByPet(@PathVariable Long id) {
        ListHolder<MedicationDispense> holder = new ListHolder<>(repo.findByPetId(id));
        return response(Result.of(holder));
    }

    @GetMapping(value = "/api/dispense/appointment/{appointmentId}")
    public ResponseEntity<List<MedicationDispense>> getByAppointment(@PathVariable Long appointmentId) {
       return ResponseEntity.ok(repo.findByAppointmentId(appointmentId));
    }

    @PostMapping(value = "/api/dispense/create")
    public ResponseEntity register(@RequestBody MedicationDispense value) {
        Result<MedicationDispense> result = service.create(value);
        return response(result);
    }

    @PatchMapping(value = "/medicationDispense/patch/{id}")
    public ResponseEntity update(@PathVariable Long id, @RequestBody List<ResourcePatch> patches) {
        Result<MedicationDispense> result = service.patch(id, patches);
        return response(result);
    }

    @DeleteMapping(value = "/medicationDispense/delete/{id}")
    public ResponseEntity delete(@PathVariable Long id) {
        Result<MedicationDispense> result = service.delete(id);
        if (result.code().isSuccess()) {
            return response(Result.of("Deleted Successfully"));
        } else {
            return response(result);
        }
    }

}
