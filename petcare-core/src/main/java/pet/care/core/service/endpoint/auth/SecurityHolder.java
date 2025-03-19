package pet.care.core.service.endpoint.auth;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import pet.care.core.domain.entity.Profile;

import java.util.ArrayList;
import java.util.Optional;

public class SecurityHolder {

    public static Profile getProfile() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof Profile) {
            return ((Profile) principal);
        } else {
            return null;
        }
    }

    public static Long getProfileId() {
        return Optional.ofNullable(getProfile()).map(Profile::getId).orElse(null);
    }

    public static void setProfile(Profile profile) {
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                profile, null, new ArrayList<>());
        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
    }
}
