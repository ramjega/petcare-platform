package pet.care.core.service.module;

import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.MedicinalProduct;
import pet.care.core.repo.jpa.MedicinalProductRepo;
import pet.care.core.service.common.Result;
import pet.care.core.service.common.StatusCode;
import pet.care.core.service.common.TxStatusCodes;

@Service
public class MedicinalProductService extends BaseResourceService<MedicinalProduct>{
    private MedicinalProductRepo medicinalProductRepo;

    public MedicinalProductService(ApplicationContext ctx, JpaRepository<MedicinalProduct, Long> repo){
        super(ctx, MedicinalProduct.class, repo);
        this.medicinalProductRepo = ctx.getBean(MedicinalProductRepo.class);
    }

    @Override
    public Result<MedicinalProduct> create(MedicinalProduct value){
        if (value.getMedicineName() == null) {
            return Result.of(StatusCode.sc(TxStatusCodes.SC_VALIDATION_FAILED, "Missing required field - Medicine Name"));
        }

        return super.create(value);
    }

    @Override
    public Result<MedicinalProduct> update(MedicinalProduct value) {
        if (value.getMedicineName() == null) {
            return Result.of(StatusCode.sc(TxStatusCodes.SC_VALIDATION_FAILED, "Missing required fields - Medicine Name"));
        }
        return super.update(value);
    }
}
