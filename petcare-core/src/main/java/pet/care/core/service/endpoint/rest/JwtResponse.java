package pet.care.core.service.endpoint.rest;

import lombok.Data;
import pet.care.core.domain.entity.Profile;
import pet.care.core.domain.type.ProfileRole;

@Data
public class JwtResponse {
    private String token;
    private String name;
    private String mobile;
    private ProfileRole role;
    private String status;

    public JwtResponse(String token, Profile profile) {
        this.token = token;
        this.name = profile.getName();
        this.mobile = profile.getMobile();
        this.role = profile.getRole();
        this.status = profile.getStatus().name();
    }
}
