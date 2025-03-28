package pet.care.core.service.endpoint.rest;

import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.core.domain.entity.ActivityLog;
import pet.care.core.domain.entity.Observation;
import pet.care.core.repo.jpa.ActivityLogRepo;
import pet.care.core.repo.jpa.ObservationRepo;
import pet.care.core.service.common.Result;
import pet.care.core.service.module.ActivityLogService;
import pet.care.core.service.module.ObservationService;

import java.util.List;

import static pet.care.core.service.common.Converter.response;


@RestController
@CrossOrigin
public class ActivityLogController {

    private final ActivityLogService service;
    private final ActivityLogRepo repo;

    public ActivityLogController(ApplicationContext context) {
        this.service = context.getBean(ActivityLogService.class);
        this.repo = context.getBean(ActivityLogRepo.class);
    }

    @GetMapping(value = "/api/activity/pet/{petId}")
    public ResponseEntity<List<ActivityLog>> getByPet(@PathVariable Long petId) {
        return ResponseEntity.ok(repo.findByPetId(petId));
    }

    @PostMapping(value = "/api/activity/create")
    public ResponseEntity register(@RequestBody ActivityLog value) {
        Result<ActivityLog> result = service.create(value);
        return response(result);
    }

}
