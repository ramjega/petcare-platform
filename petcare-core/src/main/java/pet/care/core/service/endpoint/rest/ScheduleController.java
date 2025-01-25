package pet.care.core.service.endpoint.rest;


import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.core.domain.entity.Schedule;
import pet.care.core.domain.wrapper.ListHolder;
import pet.care.core.repo.jpa.ScheduleRepo;
import pet.care.core.service.common.Result;
import pet.care.core.service.endpoint.auth.SecurityHolder;
import pet.care.core.service.module.ScheduleService;

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

    @GetMapping(value = "/schedule/get")
    public ResponseEntity get() {
        ListHolder<Schedule> holder = new ListHolder<>(repo.findByDoctorId(SecurityHolder.getProfileId()));
        return response(Result.of(holder));
    }

    @PostMapping(value = "/schedule/create")
    public ResponseEntity register(@RequestBody Schedule value) {
                Result<Schedule> result = service.create(value);
        return response(result);
    }
}
