package pet.care.core.service.endpoint.rest;


import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.core.domain.entity.Pet;
import pet.care.core.domain.entity.Schedule;
import pet.care.core.domain.type.ScheduleStatusValue;
import pet.care.core.domain.wrapper.ListHolder;
import pet.care.core.repo.jpa.ScheduleRepo;
import pet.care.core.service.common.Result;
import pet.care.core.service.endpoint.auth.SecurityHolder;
import pet.care.core.service.module.ScheduleService;

import java.util.Optional;

import static pet.care.core.service.common.Converter.response;


@RestController
@CrossOrigin
public class ScheduleController {

    private final ScheduleService service;
    private final ScheduleRepo repo;

    public ScheduleController(ApplicationContext context) {
        this.service = context.getBean(ScheduleService.class);
        this.repo = context.getBean(ScheduleRepo.class);
    }

    @GetMapping(value = "/api/schedule/my")
    public ResponseEntity get() {
        ListHolder<Schedule> holder = new ListHolder<>(repo.findByProfessionalId(SecurityHolder.getProfileId()));
        return response(Result.of(holder));
    }

    @PostMapping(value = "/api/schedule/create")
    public ResponseEntity register(@RequestBody Schedule value) {
                Result<Schedule> result = service.create(value);
        return response(result);
    }

    @PostMapping(value = "/api/schedule/activate/{id}")
    public ResponseEntity activate(@PathVariable Long id) {
        Optional<Schedule> schedule = repo.findById(id);

        if (schedule.isPresent()) {
            schedule.get().setStatus(ScheduleStatusValue.active);

            Result<Schedule> result = service.update(schedule.get());
            return response(result);
        } else {
            return response(Result.of("Schedule not found!"));
        }
    }

    @PostMapping(value = "/api/schedule/cancel/{id}")
    public ResponseEntity cancel(@PathVariable Long id) {
        Optional<Schedule> schedule = repo.findById(id);

        if (schedule.isPresent()) {
            schedule.get().setStatus(ScheduleStatusValue.cancelled);

            Result<Schedule> result = service.update(schedule.get());
            return response(result);
        } else {
            return response(Result.of("Schedule not found!"));
        }
    }

    @DeleteMapping(value = "/api/schedule/delete/{id}")
    public ResponseEntity delete(@PathVariable Long id) {
        return response(service.delete(id));
    }
}
