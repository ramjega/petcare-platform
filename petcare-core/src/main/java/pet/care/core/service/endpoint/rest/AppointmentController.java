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
import pet.care.core.service.endpoint.rest.dto.AppointmentDto;
import pet.care.core.service.module.AppointmentService;
import pet.care.core.service.util.TimeUtils;

import java.util.List;
import java.util.Optional;

import static java.util.Objects.isNull;
import static pet.care.core.service.common.Converter.response;
import static pet.care.core.service.common.StatusCode.sc;
import static pet.care.core.service.common.TxStatusCodes.SC_VALIDATION_FAILED;

@RestController
@CrossOrigin
public class AppointmentController {

    private final AppointmentService service;
    private final AppointmentRepo repo;

    public AppointmentController(ApplicationContext context) {
        this.service = context.getBean(AppointmentService.class);
        this.repo = context.getBean(AppointmentRepo.class);
    }

    @GetMapping(value = "/api/appointment/{id}")
    public ResponseEntity get(@PathVariable Long id) {
        Optional<Appointment> appointment = repo.findById(id);
        if (appointment.isPresent()) {
            return response(Result.of(appointment.get()));
        } else {
            return response(Result.of("Appointment not found for id ["+id+"]!"));
        }
    }

    @GetMapping(value = "/api/appointment/my")
    public ResponseEntity get() {
        ListHolder<Appointment> holder = new ListHolder<>(repo.findByCustomerId(SecurityHolder.getProfileId()));
        return response(Result.of(holder));
    }

    @GetMapping(value = "/api/appointment/session/{sessionId}")
    public ResponseEntity getBySession(@PathVariable Long sessionId) {
        ListHolder<Appointment> holder = new ListHolder<>(repo.findBySessionId(sessionId));
        return response(Result.of(holder));
    }

    @PostMapping(value = "/api/appointment/book")
    public ResponseEntity book(@RequestBody AppointmentDto dto) {
        Result<Appointment> result = service.book(dto);
        return response(result);
    }

    @PostMapping(value = "/api/appointment/attend/{id}")
    public ResponseEntity attend(@PathVariable Long id) {
        Result<Appointment> result = service.attend(id);
        return response(result);
    }

    @PostMapping(value = "/api/appointment/complete/{id}")
    public ResponseEntity complete(@PathVariable Long id) {
        Result<Appointment> result = service.complete(id);
        return response(result);
    }

    @PostMapping(value = "/api/appointment/cancel/{id}")
    public ResponseEntity cancel(@PathVariable Long id) {
        Result<Appointment> result = service.cancel(id);
        return response(result);
    }

    @GetMapping(value = "/api/appointment/pet/{petId}")
    public ResponseEntity<List<Appointment>> getByPet(@PathVariable Long petId) {
        return ResponseEntity.ok(repo.findByPetId(petId));
    }
}
