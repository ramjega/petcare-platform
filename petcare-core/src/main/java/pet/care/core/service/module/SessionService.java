package pet.care.core.service.module;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.Appointment;
import pet.care.core.domain.entity.Session;
import pet.care.core.domain.type.AppointmentStatus;
import pet.care.core.domain.type.SessionStatus;
import pet.care.core.repo.jpa.AppointmentRepo;
import pet.care.core.repo.jpa.SessionRepo;
import pet.care.core.service.common.Result;
import pet.care.core.service.endpoint.auth.SecurityHolder;
import pet.care.core.service.endpoint.rest.dto.SessionSearchDto;
import pet.care.core.service.util.TimeUtils;

import java.util.List;
import java.util.Optional;

import static pet.care.core.service.common.StatusCode.sc;
import static pet.care.core.service.common.TxStatusCodes.SC_NOT_FOUND;
import static pet.care.core.service.common.TxStatusCodes.SC_VALIDATION_FAILED;

@Service
public class SessionService extends BaseResourceService<Session> {

    private final AppointmentRepo appointmentRepo;
    private final SessionRepo sessionRepo;

    public SessionService(ApplicationContext ctx, SessionRepo sessionRepo, AppointmentRepo appointmentRepo) {
        super(ctx, Session.class, sessionRepo);
        this.appointmentRepo = appointmentRepo;
        this.sessionRepo = sessionRepo;
    }

    public List<Session> searchSessions(SessionSearchDto dto) {
        long start = TimeUtils.startTimeOfLocalGivenTime(dto.getFrom());
        long end = TimeUtils.startTimeOfLocalGivenTime(dto.getTo()) + TimeUtils.daysInMills(1);;
        return sessionRepo.findByFilters(
                start,
                end,
                dto.getProfessionalId(),
                dto.getSpeciality(),
                dto.getOrganizationId(),
                dto.getCityId()
        );
    }

    @Override
    public Result<Session> create(Session value) {
        if (value.getStart() == null || value.getMaxAllowed() == null || value.getOrganization() == null) {
            return Result.of(sc(SC_VALIDATION_FAILED, "Missing required fields! - start | maxAllowed | organization"));
        }

        if (value.getProfessional() == null) {
            value.setProfessional(SecurityHolder.getProfile());
        }

        return super.create(value);
    }

    public Result<Session> start(Long id) {
        Optional<Session> session = repo.findById(id);
        if (session.isPresent()) {
            session.get().setStatus(SessionStatus.Started);

            List<Appointment> noShowAppointments = appointmentRepo.findBySessionIdAndStatus(id, AppointmentStatus.noShow);
            noShowAppointments.forEach(appointment -> {
                appointment.setStatus(AppointmentStatus.booked);
                appointmentRepo.save(appointment);
            });

            return super.update(session.get());
        } else {
            return Result.of(sc(SC_NOT_FOUND, "Session not found!"));
        }
    }

    public Result<Session> complete(Long id) {
        Optional<Session> session = repo.findById(id);
        if (session.isPresent()) {
            session.get().setStatus(SessionStatus.Completed);

            List<Appointment> arrivedAppointments = appointmentRepo.findBySessionIdAndStatus(id, AppointmentStatus.arrived);
            arrivedAppointments.forEach(appointment -> {
                appointment.setStatus(AppointmentStatus.fulfilled);
                appointmentRepo.save(appointment);
            });

            List<Appointment> noshowAppointments = appointmentRepo.findBySessionIdAndStatus(id, AppointmentStatus.booked);
            noshowAppointments.forEach(appointment -> {
                appointment.setStatus(AppointmentStatus.noShow);
                appointmentRepo.save(appointment);
            });

            return super.update(session.get());
        } else {
            return Result.of(sc(SC_NOT_FOUND, "Session not found!"));
        }
    }

    public Result<Session> cancel(Long id) {
        Optional<Session> session = repo.findById(id);
        if (session.isPresent()) {
            session.get().setStatus(SessionStatus.Cancelled);

            List<Appointment> bookedAppointments = appointmentRepo.findBySessionIdAndStatus(id, AppointmentStatus.booked);
            bookedAppointments.forEach(appointment -> {
                appointment.setStatus(AppointmentStatus.cancelled);
                appointmentRepo.save(appointment);
            });

            return super.update(session.get());
        } else {
            return Result.of(sc(SC_NOT_FOUND, "Session not found!"));
        }
    }
}
