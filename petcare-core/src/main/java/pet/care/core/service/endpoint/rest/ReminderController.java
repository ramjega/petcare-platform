package pet.care.core.service.endpoint.rest;

import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.core.domain.entity.Reminder;
import pet.care.core.repo.jpa.ReminderRepo;
import pet.care.core.service.common.Result;
import pet.care.core.service.module.ReminderService;

import java.util.List;

import static pet.care.core.service.common.Converter.response;


@RestController
@CrossOrigin
public class ReminderController {

    private final ReminderService service;
    private final ReminderRepo repo;

    public ReminderController(ApplicationContext context) {
        this.service = context.getBean(ReminderService.class);
        this.repo = context.getBean(ReminderRepo.class);
    }

    @GetMapping(value = "/api/reminder/appointment/{appointmentId}")
    public ResponseEntity<List<Reminder>> getByAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(repo.findByAppointmentId(appointmentId));
    }

    @PostMapping(value = "/api/reminder/create")
    public ResponseEntity register(@RequestBody Reminder value) {
        Result<Reminder> result = service.create(value);
        return response(result);
    }

}
