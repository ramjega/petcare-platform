package pet.care.core.service.endpoint.rest;


import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.core.domain.entity.Session;
import pet.care.core.domain.wrapper.ListHolder;
import pet.care.core.repo.jpa.SessionRepo;
import pet.care.core.service.common.Result;
import pet.care.core.service.endpoint.auth.SecurityHolder;
import pet.care.core.service.module.SessionService;
import pet.care.core.service.util.TimeUtils;

import static pet.care.core.service.common.Converter.response;


@RestController
@CrossOrigin
public class SessionController {

    private final SessionService service;
    private final SessionRepo repo;

    public SessionController(ApplicationContext context) {
        this.service = context.getBean(SessionService.class);
        this.repo = context.getBean(SessionRepo.class);
    }

    @GetMapping(value = "/session/get")
    public ResponseEntity get() {
        ListHolder<Session> holder = new ListHolder<>(repo.findByDoctorId(SecurityHolder.getProfileId()));
        return response(Result.of(holder));
    }

    @GetMapping(value = "/session/upcoming")
    public ResponseEntity upcoming() {
        ListHolder<Session> holder = new ListHolder<>(repo.findByDoctorIdAndStartAfter(SecurityHolder.getProfileId(), TimeUtils.currentUtcTime()));
        return response(Result.of(holder));
    }

    @GetMapping(value = "/session/get/{dateTime}")
    public ResponseEntity getByTime(@PathVariable Long dateTime) {

        long start = TimeUtils.startTimeOfLocalGivenTime(dateTime);
        long end = start + TimeUtils.daysInMills(1);

        ListHolder<Session> holder = new ListHolder<>(repo.findByStartAfterAndStartBefore(start, end));

        return response(Result.of(holder));
    }

    @PostMapping(value = "/session/create")
    public ResponseEntity register(@RequestBody Session value) {
        Result<Session> result = service.create(value);
        return response(result);
    }

    @PostMapping(value = "/session/start/{sessionId}")
    public ResponseEntity start(@PathVariable Long sessionId) {
        Result<Session> result = service.start(sessionId);
        return response(result);
    }

    @PostMapping(value = "/session/complete/{sessionId}")
    public ResponseEntity complete(@PathVariable Long sessionId) {
        Result<Session> result = service.complete(sessionId);
        return response(result);
    }

    @PostMapping(value = "/session/cancel/{sessionId}")
    public ResponseEntity cancel(@PathVariable Long sessionId) {
        Result<Session> result = service.cancel(sessionId);
        return response(result);
    }
}
