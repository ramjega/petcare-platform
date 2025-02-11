package pet.care.core.repo;

import lombok.extern.log4j.Log4j2;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import pet.care.core.repo.jpa.ProfileRepo;
import pet.care.core.domain.entity.Profile;
import pet.care.core.repo.jpa.ScheduleRepo;
import pet.care.core.repo.jpa.ScheduledTaskRepo;
import pet.care.core.repo.jpa.SessionRepo;
import pet.care.core.service.endpoint.auth.SecurityHolder;

import javax.annotation.PostConstruct;
import java.util.Collections;

@Service
@Log4j2
public class DataManagementService {
    private final ProfileRepo profileRepo;

    public DataManagementService(ApplicationContext ctx) {
        this.profileRepo = ctx.getBean(ProfileRepo.class);
    }

    @PostConstruct
    public void execute() {

        // create initial user
        SecurityHolder.setProfile(Profile.SYSTEM);

        if (profileRepo.count() == 0) {
            log.debug("Creating initial users..");

            Profile system = Profile.SYSTEM;

            profileRepo.saveAll(Collections.singletonList(system));
        }

    }
}
