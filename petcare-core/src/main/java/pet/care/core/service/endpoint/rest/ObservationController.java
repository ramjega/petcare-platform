package pet.care.core.service.endpoint.rest;

import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.core.domain.entity.Observation;
import pet.care.core.repo.jpa.ObservationRepo;
import pet.care.core.service.common.Result;
import pet.care.core.service.module.ObservationService;

import java.util.List;

import static pet.care.core.service.common.Converter.response;


@RestController
@CrossOrigin
public class ObservationController {

    private final ObservationService service;
    private final ObservationRepo repo;

    public ObservationController(ApplicationContext context) {
        this.service = context.getBean(ObservationService.class);
        this.repo = context.getBean(ObservationRepo.class);
    }

    @GetMapping(value = "/api/observation/appointment/{appointmentId}")
    public ResponseEntity<List<Observation>> getByAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(repo.findByAppointmentId(appointmentId));
    }

    @GetMapping(value = "/api/observation/pet/{petId}")
    public ResponseEntity<List<Observation>> getByPet(@PathVariable Long petId) {
        return ResponseEntity.ok(repo.findByPetId(petId));
    }

    @PostMapping(value = "/api/observation/create")
    public ResponseEntity register(@RequestBody Observation value) {
        Result<Observation> result = service.create(value);
        return response(result);
    }

}
