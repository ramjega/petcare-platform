package pet.care.core.repo.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.core.domain.entity.Organization;
import pet.care.core.domain.entity.Profile;

@Repository
public interface OrganizationRepo extends JpaRepository<Organization, Long> {
}