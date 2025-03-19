package pet.care.core.repo.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.core.domain.entity.City;

@Repository
public interface CityRepo extends JpaRepository<City, Long> {
}