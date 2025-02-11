package pet.care.core.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import pet.care.core.domain.type.SessionStatus;

import javax.persistence.*;
import java.util.Optional;

@Data
@Entity
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Table(indexes = {
        @Index(columnList = "status"),
        @Index(columnList = "start")
})
public class Session extends ResourceEntity {

    @Id
    @GeneratedValue(generator = "session_id_generator")
    protected Long id;

    private String hospital;

    private Long maxAllowed;

    public Long getNextToken() {
        return Optional.ofNullable(nextToken).orElse(1L);
    }

    private Long nextToken = 1L;

    private Long booked = 0L;

    public Long getBooked() {
        return Optional.ofNullable(booked).orElse(0L);
    }

    private SessionStatus status = SessionStatus.Scheduled;

    private Long start;

    @ManyToOne
    @JoinColumn(name = "professionalId", referencedColumnName = "id")
    private Profile professional;

    @ManyToOne
    @JoinColumn(name = "scheduleId", referencedColumnName = "id")
    private Schedule schedule;

}

