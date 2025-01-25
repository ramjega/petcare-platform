package pet.care.core.service.module;

import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.Session;
import pet.care.core.domain.type.SessionStatus;
import pet.care.core.service.common.Result;
import pet.care.core.service.endpoint.auth.SecurityHolder;

import java.util.Optional;

import static pet.care.core.service.common.StatusCode.sc;
import static pet.care.core.service.common.TxStatusCodes.SC_NOT_FOUND;
import static pet.care.core.service.common.TxStatusCodes.SC_VALIDATION_FAILED;

@Service
public class SessionService extends BaseResourceService<Session> {

    public SessionService(ApplicationContext ctx, JpaRepository<Session, Long> repo) {
        super(ctx, Session.class, repo);
    }

    @Override
    public Result<Session> create(Session value) {
        if (value.getStart() == null || value.getHospital() == null || value.getMaxAllowed() == null) {
            return Result.of(sc(SC_VALIDATION_FAILED, "Missing required fields! - start | hospital | maxAllowed"));
        }

        value.setDoctor(SecurityHolder.getProfile());
        return super.create(value);
    }

    public Result<Session> start(Long id) {
        Optional<Session> session = repo.findById(id);
        if (session.isPresent()) {
            session.get().setStatus(SessionStatus.Started);
            return super.update(session.get());
        } else {
            return Result.of(sc(SC_NOT_FOUND, "Session not found!"));
        }
    }

    public Result<Session> complete(Long id) {
        Optional<Session> session = repo.findById(id);
        if (session.isPresent()) {
            session.get().setStatus(SessionStatus.Completed);
            return super.update(session.get());
        } else {
            return Result.of(sc(SC_NOT_FOUND, "Session not found!"));
        }
    }

    public Result<Session> cancel(Long id) {
        Optional<Session> session = repo.findById(id);
        if (session.isPresent()) {
            session.get().setStatus(SessionStatus.Cancelled);
            return super.update(session.get());
        } else {
            return Result.of(sc(SC_NOT_FOUND, "Session not found!"));
        }
    }
}
