package pet.care.core.service.module;

import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.Profile;
import pet.care.core.domain.type.ProfileStatus;
import pet.care.core.repo.jpa.ProfileRepo;
import pet.care.core.service.common.Result;
import pet.care.core.service.common.StatusCode;
import pet.care.core.service.common.TxStatusCodes;
import pet.care.core.service.endpoint.auth.SecurityHolder;

import java.util.Optional;

import static java.util.Objects.isNull;

@Service
public class ProfileService extends BaseResourceService<Profile> {
    private final ProfileRepo profileRepo;

    public ProfileService(ApplicationContext ctx, JpaRepository<Profile, Long> repo) {
        super(ctx, Profile.class, repo);
        this.profileRepo = ctx.getBean(ProfileRepo.class);
    }

    @Override
    public Result<Profile> create(Profile value) {

        if (value.getRole() == null || value.getName() == null || value.getMobile() == null || value.getPassword() == null) {
            return Result.of(StatusCode.sc(TxStatusCodes.SC_VALIDATION_FAILED, "Missing required fields - role | name | mobile | password\""));
        }

        if (!value.getMobile().startsWith("0") || value.getMobile().length() != 10) {
            return Result.of(StatusCode.sc(TxStatusCodes.SC_VALIDATION_FAILED, "Mobile number should start with 0 and must contain 10 numbers"));
        }

        if (profileRepo.findOneByMobile(value.getMobile()).isPresent()) {
            return Result.of(StatusCode.sc(TxStatusCodes.SC_ALREADY_EXIST, "Profile for mobile [" + value.getMobile() + "] is already exist!"));
        }

        return super.create(value);
    }

    public Result<Profile> complete(Profile value) {

        if (isNull(value.getRole()) || isNull(value.getName()) || isNull(value.getEmail()) || isNull(value.getAddress())) {
            return Result.of(StatusCode.sc(TxStatusCodes.SC_VALIDATION_FAILED, "Missing required fields - role | name | email | address"));
        }

        Optional<Profile> profile = profileRepo.findById(SecurityHolder.getProfileId());

        if (!profile.isPresent()) {
            return Result.of(StatusCode.sc(TxStatusCodes.SC_NOT_FOUND, "Request profile not found!"));
        }

        profile.get().setRole(value.getRole());
        profile.get().setName(value.getName());
        profile.get().setEmail(value.getEmail());
        profile.get().setAddress(value.getEmail());

        return super.update(profile.get());
    }

    @Override
    public Result<Profile> update(Profile value) {

        if (value.getMobile() == null || value.getPassword() == null) {
            return Result.of(StatusCode.sc(TxStatusCodes.SC_VALIDATION_FAILED, "Missing required fields - mobile | password"));
        }

        return super.update(value);
    }

    public Result<Profile> suspend(Long id) {
        Optional<Profile> profile = profileRepo.findById(id);
        if (profile.isPresent()) {
            profile.get().setStatus(ProfileStatus.suspended);
            return super.update(profile.get());
        } else {
            return Result.of(StatusCode.sc(TxStatusCodes.SC_NOT_FOUND, "Profile not found for id [" + id + "]"));
        }
    }

    public Result<Profile> activate(Long id) {
        Optional<Profile> profile = profileRepo.findById(id);
        if (profile.isPresent()) {
            profile.get().setStatus(ProfileStatus.active);
            return super.update(profile.get());
        } else {
            return Result.of(StatusCode.sc(TxStatusCodes.SC_NOT_FOUND, "Profile not found for id [" + id + "]"));
        }
    }

    public Result<Profile> delete(Long id) {
        Optional<Profile> profile = profileRepo.findById(id);
        if (profile.isPresent()) {
            return super.delete(profile.get().getId());
        } else {
            return Result.of(StatusCode.sc(TxStatusCodes.SC_NOT_FOUND, "Profile not found for id [" + id + "]"));
        }
    }
}
