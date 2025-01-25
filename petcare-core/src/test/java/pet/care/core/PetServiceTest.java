package pet.care.core;

import org.joda.time.LocalDate;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import pet.care.core.domain.entity.Pet;
import pet.care.core.domain.entity.Profile;
import pet.care.core.domain.type.Gender;
import pet.care.core.domain.type.PetType;
import pet.care.core.domain.type.ProfileRole;
import pet.care.core.repo.jpa.PetRepo;
import pet.care.core.repo.jpa.ProfileRepo;
import pet.care.core.service.common.Result;
import pet.care.core.service.endpoint.auth.JwtRequest;
import pet.care.core.service.endpoint.rest.AuthenticationController;
import pet.care.core.service.factory.ProfileFactory;
import pet.care.core.service.module.PetService;
import pet.care.core.service.module.ProfileService;

import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;

@SpringBootTest
@RunWith(SpringRunner.class)
public class PetServiceTest {

    private static final Logger log = LoggerFactory.getLogger(PetServiceTest.class);

    @Autowired
    PetRepo repo;

    @Autowired
    PetService service;

    @Autowired
    ProfileFactory factory;

    @Test
    public void petCreateTest() {

        Pet pet1 = new Pet();
        pet1.setName("Buddy");
        pet1.setType(PetType.Dog);
        pet1.setBreed("Golden Retriever");
        pet1.setBirthDate(LocalDate.parse("2020-05-10"));
        pet1.setGender(Gender.Male);
        pet1.setColor("Golden");
        pet1.setOwner(Profile.SYSTEM);

        Pet pet2 = new Pet();
        pet2.setName("Mittens");
        pet2.setType(PetType.Cat);
        pet2.setBreed("Siamese");
        pet2.setBirthDate(LocalDate.parse("2019-07-15"));
        pet2.setGender(Gender.Female);
        pet2.setColor("White");
        pet2.setOwner(Profile.SYSTEM);

        Result<Pet> petResult1 = service.create(pet1);
        Result<Pet> petResult2 = service.create(pet2);

        assertTrue(petResult1.code().isSuccess());
        assertTrue(petResult2.code().isSuccess());
    }

    @Test
    public void petQueryByIdTest() {
        Pet pet = new Pet();
        pet.setName("Buddy");
        pet.setType(PetType.Dog);
        pet.setBreed("Golden Retriever");
        pet.setBirthDate(LocalDate.parse("2020-05-10"));
        pet.setGender(Gender.Male);
        pet.setColor("Golden");
        pet.setOwner(Profile.SYSTEM);

        Result<Pet> petResult = service.create(pet);
        assertTrue(petResult.code().isSuccess());

        Long petId = petResult.value().getId();
        Optional<Pet> fetchedPet = service.findById(petId);

        assertTrue(fetchedPet.isPresent());
        assertEquals("Buddy", fetchedPet.get().getName());
    }

    @Test
    public void petUpdateTest() {
        Pet pet = new Pet();
        pet.setName("Buddy");
        pet.setType(PetType.Dog);
        pet.setBreed("Golden Retriever");
        pet.setBirthDate(LocalDate.parse("2020-05-10"));
        pet.setGender(Gender.Male);
        pet.setColor("Golden");
        pet.setOwner(Profile.SYSTEM);

        Result<Pet> petResult = service.create(pet);
        assertTrue(petResult.code().isSuccess());

        Pet value = petResult.value();
        value.setColor("Light Golden");
        Result<Pet> updateResult = service.update(value);

        assertTrue(updateResult.code().isSuccess());

        Long petId = updateResult.value().getId();
        Optional<Pet> fetchedPet = service.findById(petId);

        assertTrue(fetchedPet.isPresent());
        assertEquals("Light Golden", fetchedPet.get().getColor());
    }

    @Test
    public void petDeleteTest() {
        Pet pet = new Pet();
        pet.setName("Buddy");
        pet.setType(PetType.Dog);
        pet.setBreed("Golden Retriever");
        pet.setBirthDate(LocalDate.parse("2020-05-10"));
        pet.setGender(Gender.Male);
        pet.setColor("Golden");
        pet.setOwner(Profile.SYSTEM);

        Result<Pet> petResult = service.create(pet);
        assertTrue(petResult.code().isSuccess());

        Long petId = petResult.value().getId();
        Result<Pet> deleteResult = service.delete(petId);

        assertTrue(deleteResult.code().isSuccess());

        Optional<Pet> fetchResult = service.findById(petId);
        assertFalse(fetchResult.isPresent());
    }

    @Test
    public void fetchAllPetsForOwnerTest() {
        Pet pet1 = new Pet();
        pet1.setName("Buddy");
        pet1.setType(PetType.Dog);
        pet1.setBreed("Golden Retriever");
        pet1.setBirthDate(LocalDate.parse("2020-05-10"));
        pet1.setGender(Gender.Male);
        pet1.setColor("Golden");
        pet1.setOwner(Profile.SYSTEM);

        Pet pet2 = new Pet();
        pet2.setName("Mittens");
        pet2.setType(PetType.Cat);
        pet2.setBreed("Siamese");
        pet2.setBirthDate(LocalDate.parse("2019-07-15"));
        pet2.setGender(Gender.Female);
        pet2.setColor("White");
        pet2.setOwner(Profile.SYSTEM);

        service.create(pet1);
        service.create(pet2);

        List<Pet> petList = service.queryByOwner(Profile.SYSTEM.getId());
        assertFalse(petList.isEmpty());
    }

}
