package pet.care.core.service.endpoint.rest;

import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.core.domain.entity.GrowthData;
import pet.care.core.repo.jpa.GrowthDataRepo;
import pet.care.core.service.common.Result;
import pet.care.core.service.module.GrowthDataService;

import java.util.List;

import static pet.care.core.service.common.Converter.response;


@RestController
@CrossOrigin
public class GrowthDataController {

    private final GrowthDataService service;
    private final GrowthDataRepo repo;

    public GrowthDataController(ApplicationContext context) {
        this.service = context.getBean(GrowthDataService.class);
        this.repo = context.getBean(GrowthDataRepo.class);
    }


    @GetMapping(value = "/api/growthData/pet/{petId}")
    public ResponseEntity<List<GrowthData>> getByPet(@PathVariable Long petId) {
        return ResponseEntity.ok(repo.findByPetId(petId));
    }

    @PostMapping(value = "/api/growthData/create")
    public ResponseEntity register(@RequestBody GrowthData value) {
        Result<GrowthData> result = service.create(value);
        return response(result);
    }

}
