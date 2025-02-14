package pet.care.core;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import pet.care.core.domain.entity.Profile;
import pet.care.core.domain.type.ProfileRole;
import pet.care.core.domain.type.Speciality;
import pet.care.core.repo.jpa.ProfileRepo;
import pet.care.core.service.common.Result;
import pet.care.core.service.endpoint.auth.JwtRequest;
import pet.care.core.service.endpoint.rest.AuthenticationController;
import pet.care.core.service.factory.ProfileFactory;
import pet.care.core.service.module.ProfileService;

import java.util.Optional;

import static org.junit.Assert.*;

@SpringBootTest
@RunWith(SpringRunner.class)
public class ProfileServiceTest {

    private static final Logger log = LoggerFactory.getLogger(ProfileServiceTest.class);

    @Autowired
    ProfileRepo repo;

    @Autowired
    ProfileService service;

    @Autowired
    ProfileFactory factory;

    @Autowired
    AuthenticationController authController;

    @Test
    public void profileCreateTest() {
        log.debug("Clearing previous users...");
        repo.findOneByMobile("0775228995").ifPresent(userProfile -> repo.delete(userProfile));
        repo.findOneByMobile("0779010066").ifPresent(userProfile -> repo.delete(userProfile));
        repo.findOneByMobile("0776914221").ifPresent(userProfile -> repo.delete(userProfile));
        repo.findOneByMobile("0777970070").ifPresent(userProfile -> repo.delete(userProfile));

        Result<Profile> admin = factory.createAdmin("Gowri", "0776914221", "Test@123");
        assertTrue(admin.code().isSuccess());

        Result<Profile> petOwner = factory.createPetOwner("Jegan", "0779010066", "Test@123");
        assertTrue(petOwner.code().isSuccess());

        Result<Profile> professional = factory.createProfessional("Sriram", "0775228995", "Test@123", Speciality.Veterinary);
        assertTrue(professional.code().isSuccess());

        Result<Profile> community = factory.createCommunity("Community", "0777970070", "Test@123");
        assertTrue(community.code().isSuccess());

        // number duplicate test
        Result<Profile> community2 = factory.createCommunity("Community", "0777970070", "Test@123");
        assertTrue(community2.code().isFailure());
    }

    @Test
    public void invalidInputTest() {

        // clear existing user
        repo.findOneByMobile("0773456789").ifPresent(userProfile -> repo.delete(userProfile));

        // user without role
        Profile profile = new Profile();
        profile.setEmail("nimal@gmail.com");
        profile.setName("Nimal");
        profile.setMobile("0773456789");
        profile.setPassword("54sdf990");

        // check whether result is failure
        Result<Profile> result1 = service.create(profile);
        assertTrue(result1.code().isFailure());

        // user without name
        profile.setRole(ProfileRole.admin);
        profile.setName(null);

        // check whether result is failure
        Result<Profile> result2 = service.create(profile);
        assertTrue(result2.code().isFailure());

        // user without mobile
        profile.setName("Nimal");
        profile.setMobile(null);

        // check whether result is failure
        Result<Profile> result3 = service.create(profile);
        assertTrue(result3.code().isFailure());

        // user without password
        profile.setMobile("0773456789");
        profile.setPassword(null);

        // check whether result is failure
        Result<Profile> result4 = service.create(profile);
        assertTrue(result4.code().isFailure());

        // user with all attributes
        profile.setPassword("Test@123");

        // check whether result is success
        Result<Profile> result5 = service.create(profile);
        assertTrue(result5.code().isSuccess());
    }

    @Test
    public void profileQueryTest() {

        log.debug("Clearing previous users...");
        repo.findOneByMobile("0775228995").ifPresent(userProfile -> repo.delete(userProfile));
        repo.findOneByMobile("0779010066").ifPresent(userProfile -> repo.delete(userProfile));
        repo.findOneByMobile("0776914220").ifPresent(userProfile -> repo.delete(userProfile));
        repo.findOneByMobile("0777878789").ifPresent(userProfile -> repo.delete(userProfile));

        Result<Profile> admin = factory.createAdmin("Gowri", "0776914220", "Test@123");
        assertTrue(admin.code().isSuccess());

        Result<Profile> petOwner = factory.createPetOwner("Jegan", "0779010066", "Test@123");
        assertTrue(petOwner.code().isSuccess());

        Result<Profile> professional = factory.createProfessional("Sriram", "0775228995", "Test@123", Speciality.Veterinary);
        assertTrue(professional.code().isSuccess());

        Optional<Profile> adminFound = repo.findOneByMobile("0776914220");
        assertTrue(adminFound.isPresent());
        assertEquals("Gowri", adminFound.get().getName());

        Optional<Profile> petOwnerFound = repo.findOneByMobile("0779010066");
        assertTrue(petOwnerFound.isPresent());
        assertEquals("Jegan", petOwnerFound.get().getName());

        Optional<Profile> petProfessionalFound = repo.findOneByMobile("0775228995");
        assertTrue(petProfessionalFound.isPresent());
        assertEquals("Sriram", petProfessionalFound.get().getName());

        assertFalse(repo.findOneByMobile("0777878789").isPresent());
    }

    @Test
    public void professionalLoginTest() {

        // clearing previously created user
        repo.findOneByMobile("0775228995").ifPresent(userProfile -> repo.delete(userProfile));

        Result<Profile> professional = factory.createProfessional("Sriram", "0775228995", "Test@123", Speciality.Veterinary);
        assertTrue(professional.code().isSuccess());

        JwtRequest authenticationRequest = new JwtRequest(professional.value().getMobile(), "Test@123");

        // attempt one with correct mobile no and password
        ResponseEntity response1 = authController.createAuthenticationToken(authenticationRequest);

        assertEquals(200, response1.getStatusCode().value());

        authenticationRequest.setPassword("random_pwd");

        // attempt one with correct mobile no and invalid password
        ResponseEntity response2 = authController.createAuthenticationToken(authenticationRequest);

        assertEquals(401, response2.getStatusCode().value());
    }

    @Test
    public void petOwnerLoginTest() {

        // clearing previously created user
        repo.findOneByMobile("0779010066").ifPresent(userProfile -> repo.delete(userProfile));

        Result<Profile> petOwner = factory.createPetOwner("Jegan", "0779010066", "Test@123");
        assertTrue(petOwner.code().isSuccess());

        JwtRequest authenticationRequest = new JwtRequest(petOwner.value().getMobile(), "Test@123");

        // attempt one with correct mobile no and password
        ResponseEntity response1 = authController.createAuthenticationToken(authenticationRequest);

        assertEquals(200, response1.getStatusCode().value());

        authenticationRequest.setPassword("random_pwd");

        // attempt one with correct mobile no and invalid password
        ResponseEntity response2 = authController.createAuthenticationToken(authenticationRequest);

        assertEquals(401, response2.getStatusCode().value());
    }

    @Test
    public void adminLoginTest() {

        // clearing previously created user
        repo.findOneByMobile("0776914221").ifPresent(userProfile -> repo.delete(userProfile));

        Result<Profile> admin = factory.createAdmin("Gowri", "0776914221", "Test@123");
        assertTrue(admin.code().isSuccess());

        JwtRequest authenticationRequest = new JwtRequest(admin.value().getMobile(), "Test@123");

        // attempt one with correct mobile no and password
        ResponseEntity response1 = authController.createAuthenticationToken(authenticationRequest);

        assertEquals(200, response1.getStatusCode().value());

        authenticationRequest.setPassword("random_pwd");

        // attempt one with correct mobile no and invalid password
        ResponseEntity response2 = authController.createAuthenticationToken(authenticationRequest);

        assertEquals(401, response2.getStatusCode().value());
    }
}
