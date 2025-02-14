package pet.care.core.service.endpoint.rest;


import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.core.domain.entity.Pet;
import pet.care.core.domain.entity.Profile;
import pet.care.core.domain.type.ProfileRole;
import pet.care.core.repo.jpa.ProfileRepo;
import pet.care.core.service.common.ResourcePatch;
import pet.care.core.service.common.Result;
import pet.care.core.service.common.StatusCode;
import pet.care.core.service.common.TxStatusCodes;
import pet.care.core.service.endpoint.auth.JwtRequest;
import pet.care.core.service.endpoint.auth.SecurityHolder;
import pet.care.core.service.module.ProfileService;

import java.util.List;
import java.util.Optional;

import static pet.care.core.service.common.Converter.response;


@RestController
@CrossOrigin
public class ProfileController {

    private final ProfileService service;
    private final ProfileRepo repo;
    private final AuthenticationController authController;

    public ProfileController(ApplicationContext context) {
        this.service = context.getBean(ProfileService.class);
        this.repo = context.getBean(ProfileRepo.class);
        this.authController = context.getBean(AuthenticationController.class);
    }

    @GetMapping(value = "/api/profile/professionals")
    public ResponseEntity<List<Profile>> getProfessionals() {
        return ResponseEntity.ok(repo.findAllByRole(ProfileRole.professional));
    }

    @GetMapping(value = "/api/profile/me")
    public ResponseEntity get() {
        Optional<Profile> profile = repo.findById(SecurityHolder.getProfileId());

        if (profile.isPresent()) {
            return response(Result.of(profile.get()));
        } else {
            return response(Result.of(StatusCode.sc(TxStatusCodes.SC_VALIDATION_FAILED, "Profile not found for id [" + SecurityHolder.getProfileId() + "]")));
        }
    }

    @PostMapping(value = "/api/profile/register")
    public ResponseEntity create(@RequestBody Profile value) {
        String mobile = value.getMobile();
        String password = value.getPassword();

        Result<Profile> result = service.create(value);

        if (result.code().isSuccess()) {
            JwtRequest jwtRequest = new JwtRequest(mobile, password);
            return authController.createAuthenticationToken(jwtRequest);
        } else {
            return response(result);
        }
    }

    @PatchMapping(value = "/profile/patch/{id}")
    public ResponseEntity update(@PathVariable Long id, @RequestBody List<ResourcePatch> patches) {
        return response(service.patch(id, patches));
    }

    @PostMapping(value = "/api/profile/update")
    public ResponseEntity update(@RequestBody Profile value) {
        Optional<Profile> profile = repo.findById(value.getId());

        if (profile.isPresent()) {
            if (!profile.get().getMobile().equals(value.getMobile())) {
                if (repo.findOneByMobile(value.getMobile()).isPresent()) {
                    return response(Result.of(StatusCode.sc(TxStatusCodes.SC_VALIDATION_FAILED, "Mobile number ["+value.getMobile()+"] is associated with another account!")));
                }
            }

            profile.get().setMobile(value.getMobile());
            profile.get().setName(value.getName());
            profile.get().setEmail(value.getEmail());
            profile.get().setAddress(value.getAddress());
            profile.get().setImageUrl(value.getImageUrl());

            if (value.getRole() != null) {
                profile.get().setRole(value.getRole());
            }

            Result<Profile> result = service.update(profile.get());
            return response(result);
        } else {
            return response(Result.of("Profile not found!"));
        }

    }

    @PostMapping(value = "/profile/suspend/{id}")
    public ResponseEntity suspend(@PathVariable Long id) {
        return response(service.suspend(id));
    }

    @PostMapping(value = "/profile/activate/{id}")
    public ResponseEntity activate(@PathVariable Long id) {
        return response(service.activate(id));
    }

    @DeleteMapping(value = "/profile/delete/{id}")
    public ResponseEntity delete(@PathVariable Long id) {
        Result<Profile> result = service.delete(id);
        if (result.code().isSuccess()) {
            return response(Result.of("Deleted Successfully"));
        } else {
            return response(result);
        }
    }
}
