package pet.care.core.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import pet.care.core.domain.type.ProfileRole;
import pet.care.core.domain.type.ProfileStatus;

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
        @Index(columnList = "role")
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

    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @Size(max = 255, message = "Address cannot exceed 255 characters")
    private String address;

    private ProfileRole role;

    @Size(max = 100, message = "Specialization cannot exceed 100 characters")
    private String specialization;

    // Encode password before persisting
    @PrePersist
    private void encodePassword() {
        if (this.password != null && !this.password.isEmpty()) {
            this.password = new BCryptPasswordEncoder().encode(this.password);
        }
    }
}
