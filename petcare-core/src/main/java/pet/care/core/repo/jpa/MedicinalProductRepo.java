package pet.care.core.repo.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import pet.care.core.domain.entity.MedicationDispense;
import pet.care.core.domain.entity.MedicinalProduct;
import pet.care.core.domain.entity.Pet;

import java.util.Optional;

public interface MedicinalProductRepo extends JpaRepository<MedicinalProduct,Long> {
    Optional<MedicinalProduct> findOneById(Long id);
}
