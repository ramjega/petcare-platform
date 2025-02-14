package pet.care.core.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import pet.care.core.domain.type.ProfileRole;
import pet.care.core.domain.type.ProfileStatus;
import pet.care.core.domain.type.Speciality;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@Entity
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Table(indexes = {
        @Index(columnList = "mobile", unique = true),
        @Index(columnList = "email"),
        @Index(columnList = "role"),
        @Index(columnList = "speciality")
})

public class Profile extends ResourceEntity {

    // Static System Profile
    @JsonIgnore
    public static final Profile SYSTEM;

    static {
        SYSTEM = new Profile();
        SYSTEM.setId(1L);
        SYSTEM.setMobile("mobile");
        SYSTEM.setPassword("password");
    }

    @Id
    @GeneratedValue(generator = "profile_id_generator")
    protected Long id;

    @Size(max = 15, message = "Mobile number cannot exceed 15 characters")
    private String mobile;

    private String password;

    private ProfileStatus status = ProfileStatus.active;

    private String name;

    private String email;

    private String address;

    private ProfileRole role;

    private Speciality speciality;

    private String imageUrl;

    // Encode password before persisting
    @PrePersist
    private void encodePassword() {
        if (this.password != null && !this.password.isEmpty()) {
            this.password = new BCryptPasswordEncoder().encode(this.password);
        }
    }
}
