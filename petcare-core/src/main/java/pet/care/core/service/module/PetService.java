package pet.care.core.service.module;

import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.Pet;
import pet.care.core.repo.jpa.PetRepo;
import pet.care.core.service.common.Result;
import pet.care.core.service.common.StatusCode;
import pet.care.core.service.common.TxStatusCodes;
import pet.care.core.service.endpoint.auth.SecurityHolder;

import java.util.List;

@Service
public class PetService extends BaseResourceService<Pet> {
    private final PetRepo repo;
    private final PetRepo petRepo;

    public PetService(ApplicationContext ctx, JpaRepository<Pet, Long> repo, PetRepo petRepo) {
        super(ctx, Pet.class, repo);
        this.repo = ctx.getBean(PetRepo.class);
        this.petRepo = petRepo;
    }

    @Override
    public Result<Pet> create(Pet value) {
        if (value.getName() == null || value.getType() == null || value.getGender() == null) {
            return Result.of(StatusCode.sc(TxStatusCodes.SC_VALIDATION_FAILED, "Missing required field - name | type | gender"));
        }

        value.setOwner(SecurityHolder.getProfile());
        return super.create(value);
    }

    public List<Pet> queryByOwner(Long ownerId) {
        return petRepo.findByOwnerId(ownerId);
    }

    @Override
    public Result<Pet> update(Pet value) {
        if (value.getName() == null || value.getType() == null || value.getGender() == null) {
            return Result.of(StatusCode.sc(TxStatusCodes.SC_VALIDATION_FAILED, "Missing required field - name | type | gender"));
        }
        return super.update(value);
    }
}
