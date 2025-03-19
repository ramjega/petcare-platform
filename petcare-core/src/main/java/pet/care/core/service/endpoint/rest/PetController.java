package pet.care.core.service.endpoint.rest;


import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.core.domain.entity.Pet;
import pet.care.core.domain.wrapper.ListHolder;
import pet.care.core.repo.jpa.PetRepo;
import pet.care.core.service.common.ResourcePatch;
import pet.care.core.service.common.Result;
import pet.care.core.service.endpoint.auth.SecurityHolder;
import pet.care.core.service.module.PetService;

import java.util.List;
import java.util.Optional;

import static pet.care.core.service.common.Converter.response;


@RestController
@CrossOrigin
public class PetController {

    private final PetRepo repo;
    private final PetService service;

    public PetController(ApplicationContext context) {
        this.service = context.getBean(PetService.class);
        this.repo = context.getBean(PetRepo.class);
    }

    @GetMapping(value = "/api/pets")
    public ResponseEntity fetch() {
        List<Pet> pets = repo.findByOwnerId(SecurityHolder.getProfileId());

        ListHolder holder = new ListHolder(pets);
        return response(Result.of(holder));
    }

    @GetMapping(value = "/api/pet/{id}")
    public ResponseEntity fetchById(@PathVariable Long id) {
        Optional<Pet> pet = repo.findById(id);

        if (pet.isPresent()) {
            return response(Result.of(pet.get()));
        } else {
            return response(Result.of("Pet not found for id ["+id+"]!"));
        }
    }

    @PostMapping(value = "/api/pet/register")
    public ResponseEntity register(@RequestBody Pet value) {
        Result<Pet> result = service.create(value);
        return response(result);
    }

    @PostMapping(value = "/api/pet/update")
    public ResponseEntity update(@RequestBody Pet value) {
        Optional<Pet> pet = repo.findById(value.getId());

        if (pet.isPresent()) {
            pet.get().setName(value.getName());
            pet.get().setType(value.getType());
            pet.get().setBreed(value.getBreed());
            pet.get().setGender(value.getGender());
            pet.get().setColor(value.getColor());
            pet.get().setBirthDate(value.getBirthDate());
            pet.get().setImageUrl(value.getImageUrl());

            Result<Pet> result = service.update(pet.get());
            return response(result);
        } else {
            return response(Result.of("Pet not found!"));
        }

    }

    @DeleteMapping(value = "/api/pet/delete/{id}")
    public ResponseEntity delete(@PathVariable Long id) {
        return response(service.delete(id));
    }
}
