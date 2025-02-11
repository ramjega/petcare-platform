package pet.care.core.service.module;

import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.Appointment;
import pet.care.core.domain.entity.Session;
import pet.care.core.domain.type.AppointmentStatus;
import pet.care.core.repo.jpa.AppointmentRepo;
import pet.care.core.repo.jpa.PetRepo;
import pet.care.core.repo.jpa.SessionRepo;
import pet.care.core.service.common.Result;
import pet.care.core.service.endpoint.auth.SecurityHolder;

import java.util.Optional;

import static java.util.Objects.isNull;
import static pet.care.core.service.common.StatusCode.sc;
import static pet.care.core.service.common.TxStatusCodes.SC_NOT_FOUND;
import static pet.care.core.service.common.TxStatusCodes.SC_VALIDATION_FAILED;

@Service
public class AppointmentService extends BaseResourceService<Appointment> {

    private final AppointmentRepo repo;
    private final SessionRepo sessionRepo;
    private final PetRepo petRepo;

    public AppointmentService(ApplicationContext ctx, JpaRepository<Appointment, Long> repo) {
        super(ctx, Appointment.class, repo);
        this.repo = ctx.getBean(AppointmentRepo.class);
        this.sessionRepo = ctx.getBean(SessionRepo.class);
        this.petRepo = ctx.getBean(PetRepo.class);
    }

    @Override
    public Result<Appointment> create(Appointment value) {
        if (isNull(value.getSession()) || isNull(value.getSession().getId())) {
            return Result.of(sc(SC_VALIDATION_FAILED, "Missing required fields! - session "));
        }

        if (!petRepo.findById(value.getPet().getId()).isPresent()) {
            return Result.of(sc(SC_NOT_FOUND, "Given pet is not exist in the database"));
        }

        value.setCustomer(SecurityHolder.getProfile());

        Optional<Session> sessionFound = sessionRepo.findById(value.getSession().getId());

        if (sessionFound.isPresent()) {
            Session session = sessionFound.get();

            long bookedAppointments = repo.countAppointmentByStatusIsNotAndSessionId(AppointmentStatus.cancelled, value.getSession().getId());

            if (bookedAppointments < session.getMaxAllowed()) {
                value.setToken(session.getNextToken());
                Result<Appointment> result = super.create(value);

                if (result.code().isSuccess()) {
                    session.setNextToken(value.getToken() + 1L);
                    session.setBooked(session.getBooked() + 1L);
                    sessionRepo.save(session);
                }
                return result;
            } else {
                return Result.of(sc(SC_VALIDATION_FAILED, "Session is full!"));
            }

        } else {
            return Result.of(sc(SC_NOT_FOUND, "Given session is not exist in the database"));
        }
    }

    public Result<Appointment> attend(Long id) {
        Optional<Appointment> appointmentFound = repo.findById(id);

        if (appointmentFound.isPresent()) {
            if (appointmentFound.get().getStatus() == AppointmentStatus.booked) {
                appointmentFound.get().setStatus(AppointmentStatus.arrived);
                return update(appointmentFound.get());
            } else {
                return Result.of(sc(SC_VALIDATION_FAILED, "Appointment status should be [booked]"));
            }
        } else {
            return Result.of(sc(SC_NOT_FOUND, "Appointment not found for id [" + id + "]"));
        }
    }

    public Result<Appointment> complete(Long id) {
        Optional<Appointment> appointmentFound = repo.findById(id);

        if (appointmentFound.isPresent()) {
            if (appointmentFound.get().getStatus() == AppointmentStatus.arrived) {
                appointmentFound.get().setStatus(AppointmentStatus.fulfilled);
                return update(appointmentFound.get());
            } else {
                return Result.of(sc(SC_NOT_FOUND, "Appointment status should be [arrived]"));
            }

        } else {
            return Result.of(sc(SC_NOT_FOUND, "Appointment not found for id [" + id + "]"));
        }
    }

    public Result<Appointment> cancel(Long id) {
        Optional<Appointment> appointmentFound = repo.findById(id);

        if (appointmentFound.isPresent()) {

            if (appointmentFound.get().getStatus() == AppointmentStatus.booked) {
                appointmentFound.get().setStatus(AppointmentStatus.cancelled);
                Result<Appointment> result = update(appointmentFound.get());

                if (result.code().isSuccess()) {
                    Optional<Session> session = sessionRepo.findById(appointmentFound.get().getSession().getId());
                    if (session.isPresent()) {
                        session.get().setBooked(session.get().getBooked() - 1L);
                        sessionRepo.save(session.get());
                    }
                }
                return result;
            } else {
                return Result.of(sc(SC_VALIDATION_FAILED, "Appointment status should be [booked]"));
            }

        } else {
            return Result.of(sc(SC_NOT_FOUND, "Appointment not found for id [" + id + "]"));
        }
    }
}
