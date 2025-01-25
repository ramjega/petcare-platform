package pet.care.core.service.factory;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.Profile;
import pet.care.core.domain.type.ProfileRole;
import pet.care.core.domain.type.ProfileStatus;
import pet.care.core.service.common.Result;
import pet.care.core.service.module.ProfileService;

@Service
public class ProfileFactory {
    private final ProfileService profileService;

    public ProfileFactory(ApplicationContext context) {
        this.profileService = context.getBean(ProfileService.class);
    }

    public Result<Profile> createPetOwner(String name, String mobile, String password) {
        return createUserProfile(name, mobile, password, ProfileRole.pet_owner);
    }

    public Result<Profile> createProfessional(String name, String mobile, String password) {
        return createUserProfile(name, mobile, password, ProfileRole.professional);
    }

    public Result<Profile> createCommunity(String name, String mobile, String password) {
        return createUserProfile(name, mobile, password, ProfileRole.community);
    }

    public Result<Profile> createAdmin(String name, String mobile, String password) {
        return createUserProfile(name, mobile, password, ProfileRole.admin);
    }

    public Result<Profile> createSystemUser() {
        return profileService.create(Profile.SYSTEM);
    }

    private Result<Profile> createUserProfile(String name, String mobile, String password, ProfileRole role) {
        Profile userProfile = new Profile();
        userProfile.setName(name);
        userProfile.setMobile(mobile);
        userProfile.setPassword(password);
        userProfile.setRole(role);
        userProfile.setStatus(ProfileStatus.active);
        return profileService.create(userProfile);
    }
}


