package pet.care.core.service.endpoint.rest;


import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.core.domain.entity.Appointment;
import pet.care.core.domain.entity.Session;
import pet.care.core.domain.wrapper.ListHolder;
import pet.care.core.repo.jpa.AppointmentRepo;
import pet.care.core.service.common.Result;
import pet.care.core.service.endpoint.auth.SecurityHolder;
import pet.care.core.service.module.AppointmentService;
import pet.care.core.service.util.TimeUtils;

import static pet.care.core.service.common.Converter.response;


@RestController
@CrossOrigin
public class AppointmentController {

    private final AppointmentService service;
    private final AppointmentRepo repo;

    public AppointmentController(ApplicationContext context) {
        this.service = context.getBean(AppointmentService.class);
        this.repo = context.getBean(AppointmentRepo.class);
    }

    @GetMapping(value = "/appointment/get")
    public ResponseEntity get() {
        ListHolder<Appointment> holder = new ListHolder<>(repo.findByCustomerId(SecurityHolder.getProfileId()));
        return response(Result.of(holder));
    }

    @GetMapping(value = "/appointment/get/session/{sessionId}")
    public ResponseEntity getBySession(@PathVariable Long sessionId) {
        ListHolder<Appointment> holder = new ListHolder<>(repo.findBySessionId(sessionId));
        return response(Result.of(holder));
    }

    @PostMapping(value = "/appointment/create")
    public ResponseEntity register(@RequestBody Appointment value) {
        Result<Appointment> result = service.create(value);
        return response(result);
    }

    @PostMapping(value = "/appointment/attend/{id}")
    public ResponseEntity attend(@PathVariable Long id) {
        Result<Appointment> result = service.attend(id);
        return response(result);
    }

    @PostMapping(value = "/appointment/complete/{id}")
    public ResponseEntity complete(@PathVariable Long id) {
        Result<Appointment> result = service.complete(id);
        return response(result);
    }

    @PostMapping(value = "/appointment/cancel/{id}")
    public ResponseEntity cancel(@PathVariable Long id) {
        Result<Appointment> result = service.cancel(id);
        return response(result);
    }
}
