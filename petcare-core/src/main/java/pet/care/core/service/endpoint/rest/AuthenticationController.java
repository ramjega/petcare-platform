package pet.care.core.service.endpoint.rest;


import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import pet.care.core.domain.entity.Profile;
import pet.care.core.domain.type.ProfileStatus;
import pet.care.core.repo.jpa.ProfileRepo;
import pet.care.core.service.common.Converter;
import pet.care.core.service.common.Result;
import pet.care.core.service.common.StatusCode;
import pet.care.core.service.common.TxStatusCodes;
import pet.care.core.service.endpoint.auth.JwtRequest;
import pet.care.core.service.endpoint.auth.JwtTokenUtil;
import pet.care.core.service.endpoint.auth.JwtUserDetailsService;

@RestController
@CrossOrigin
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final JwtUserDetailsService userDetailsService;
    private final ProfileRepo profileRepo;

    public AuthenticationController(ApplicationContext context) {
        this.authenticationManager = context.getBean(AuthenticationManager.class);
        this.jwtTokenUtil = context.getBean(JwtTokenUtil.class);
        this.userDetailsService = context.getBean(JwtUserDetailsService.class);
        this.profileRepo = context.getBean(ProfileRepo.class);
    }

    @PostMapping(value = "/authenticate")
    public ResponseEntity createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) {

        Result result = authenticate(authenticationRequest.getMobile(), authenticationRequest.getPassword());

        if (result.code().isFailure()) {
            return Converter.response(result);
        }

        final UserDetails userDetails = userDetailsService
                .loadUserByUsername(authenticationRequest.getMobile());

        Profile profile = userDetailsService.loadProfile(authenticationRequest.getMobile());

        if (profile.getStatus() != ProfileStatus.active) {
            return Converter.response(Result.of(StatusCode.sc(TxStatusCodes.SC_VALIDATION_FAILED, "Profile is not active!")));
        }

        final String token = jwtTokenUtil.generateToken(userDetails);

        profile.setToken(token);

        return ResponseEntity.ok(profile);
    }

    private Result authenticate(String username, String password) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
            return Result.of(TxStatusCodes.SC_SUCCESS);
        } catch (DisabledException e) {
            return Result.of(StatusCode.sc(TxStatusCodes.SC_VALIDATION_FAILED, "Profile is disabled"));
        } catch (BadCredentialsException e) {
            return Result.of(StatusCode.sc(TxStatusCodes.SC_NOT_AUTHORIZED, "Invalid mobile or password"));
        }
    }
}
