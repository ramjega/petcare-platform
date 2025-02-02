package pet.care.core.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.joda.time.LocalDate;
import pet.care.core.domain.type.Gender;
import pet.care.core.domain.type.PetType;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@Entity
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Table(indexes = {
        @Index(columnList = "name"),
        @Index(columnList = "type"),
        @Index(columnList = "ownerId")
})
public class Pet extends ResourceEntity {

    @Id
    @GeneratedValue(generator = "pet_id_generator")
    protected Long id;

    @NotNull(message = "Name is required")
    @Size(max = 50, message = "Name cannot exceed 50 characters")
    private String name;

    private PetType type;

    @Size(max = 100, message = "Breed cannot exceed 100 characters")
    private String breed;

    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Gender is required")
    private Gender gender;

    @Size(max = 30, message = "Color cannot exceed 30 characters")
    private String color;

    @ManyToOne
    @JoinColumn(name = "ownerId", referencedColumnName = "id", nullable = false)
    @NotNull(message = "Owner is required")
    private Profile owner;

    private String imageUrl;
}
