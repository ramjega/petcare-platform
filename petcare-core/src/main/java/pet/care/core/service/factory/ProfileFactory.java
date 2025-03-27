package pet.care.core.service.factory;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.Profile;
import pet.care.core.domain.type.ProfileRole;
import pet.care.core.domain.type.ProfileStatus;
import pet.care.core.domain.type.Speciality;
import pet.care.core.service.common.Result;
import pet.care.core.service.module.ProfileService;

@Service
public class ProfileFactory {
    private final ProfileService service;

    public ProfileFactory(ApplicationContext context) {
        this.service = context.getBean(ProfileService.class);
    }

    public Result<Profile> createPetOwner(String name, String mobile, String password, String email, String imageUrl) {
        return createUserProfile(name, mobile, password, ProfileRole.pet_owner, email, imageUrl);
    }

    public Result<Profile> createProfessional(String name, String mobile, String password, Speciality speciality, String email, String imageUrl) {
        return createProfessionalProfile(name, mobile, password, speciality, email, imageUrl);
    }

    public Result<Profile> createCommunity(String name, String mobile, String password, String email, String imageUrl) {
        return createUserProfile(name, mobile, password, ProfileRole.community, email, imageUrl);
    }

    public Result<Profile> createAdmin(String name, String mobile, String password, String email, String imageUrl) {
        return createUserProfile(name, mobile, password, ProfileRole.admin, email, imageUrl);
    }

    public Result<Profile> createSystemUser() {
        return service.create(Profile.SYSTEM);
    }

    private Result<Profile> createUserProfile(String name, String mobile, String password, ProfileRole role, String email, String imageUrl) {
        Profile userProfile = new Profile();
        userProfile.setName(name);
        userProfile.setMobile(mobile);
        userProfile.setPassword(password);
        userProfile.setRole(role);
        userProfile.setStatus(ProfileStatus.active);
        userProfile.setEmail(email);
        userProfile.setImageUrl(imageUrl);
        return service.create(userProfile);
    }

    private Result<Profile> createProfessionalProfile(String name, String mobile, String password, Speciality speciality, String email, String imageUrl) {
        Profile userProfile = new Profile();
        userProfile.setName(name);
        userProfile.setMobile(mobile);
        userProfile.setPassword(password);
        userProfile.setRole(ProfileRole.professional);
        userProfile.setSpeciality(speciality);
        userProfile.setStatus(ProfileStatus.active);
        userProfile.setEmail(email);
        userProfile.setImageUrl(imageUrl);
        return service.create(userProfile);
    }
}


