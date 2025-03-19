package pet.care.core.repo.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.core.domain.entity.Session;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pet.care.core.domain.type.Speciality;

import java.time.Instant;
import java.util.List;

@Repository
public interface SessionRepo extends JpaRepository<Session, Long> {

    List<Session> findByProfessionalId(Long id);
    List<Session> findByProfessionalIdAndStartAfter(Long id, Long start);
    List<Session> findByProfessionalIdAndStartAfterAndStartBefore(Long id, Long start, Long end);

    @Query("SELECT s FROM Session s WHERE "
            + "(:from IS NULL OR s.start >= :from) "
            + "AND (:to IS NULL OR s.start <= :to) "
            + "AND (:professionalId IS NULL OR s.professional.id = :professionalId) "
            + "AND (:speciality IS NULL OR s.professional.speciality = :speciality) "
            + "AND (:organizationId IS NULL OR s.organization.id = :organizationId) "
            + "AND (:cityId IS NULL OR s.organization.city.id = :cityId) "

    )

    List<Session> findByFilters(
            @Param("from") Long from,
            @Param("to") Long to,
            @Param("professionalId") Long professionalId,
            @Param("speciality") Speciality speciality,
            @Param("organizationId") Long organizationId,
            @Param("cityId") Long cityId);
}
