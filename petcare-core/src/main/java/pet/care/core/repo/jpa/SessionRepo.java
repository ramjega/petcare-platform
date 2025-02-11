package pet.care.core.repo.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.core.domain.entity.Session;

import java.util.List;

@Repository
public interface SessionRepo extends JpaRepository<Session, Long> {
    List<Session> findByProfessionalId(Long id);
    List<Session> findByProfessionalIdAndStartAfter(Long id, Long start);
    List<Session> findByStartAfterAndStartBefore(Long start, Long end);
    List<Session> findByProfessionalIdAndStartAfterAndStartBefore(Long id, Long start, Long end);
}