package pet.care.core.repo.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import pet.care.core.domain.entity.GrowthData;

import java.util.List;

public interface GrowthDataRepo extends JpaRepository<GrowthData, Long> {
    List<GrowthData> findByPetId(Long id);
}
