package pet.care.core.repo.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.core.domain.entity.Pet;

import java.util.List;

@Repository
public interface PetRepo extends JpaRepository<Pet, Long> {
    List<Pet> findByOwnerId(Long id);
}