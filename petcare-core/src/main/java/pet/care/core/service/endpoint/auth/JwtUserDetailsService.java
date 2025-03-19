package pet.care.core.service.endpoint.auth;

import org.springframework.context.ApplicationContext;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.Profile;
import pet.care.core.repo.jpa.ProfileRepo;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class JwtUserDetailsService implements UserDetailsService {

    private final ProfileRepo profileRepo;

    public JwtUserDetailsService(ApplicationContext context) {
        this.profileRepo = context.getBean(ProfileRepo.class);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Profile> profile = profileRepo.findOneByMobile(username);

        if (profile.isPresent()) {
            return new org.springframework.security.core.userdetails.User(profile.get().getMobile(), profile.get().getPassword(),
                    new ArrayList<>());
        } else {
            throw new UsernameNotFoundException("Profile not found for mobile: " + username);
        }
    }

    public Profile loadProfile(String mobile) throws UsernameNotFoundException {
        Optional<Profile> profile = profileRepo.findOneByMobile(mobile);

        if (profile.isPresent()) {
            return profile.get();
        } else {
            throw new UsernameNotFoundException("Profile not found for mobile: " + mobile);
        }
    }
}
