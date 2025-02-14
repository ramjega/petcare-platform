package pet.care.core.repo.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.core.domain.entity.Profile;
import pet.care.core.domain.type.ProfileRole;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileRepo extends JpaRepository<Profile, Long> {
    Optional<Profile> findOneByMobile(String mobile);

    List<Profile> findAllByRole(ProfileRole role);
}