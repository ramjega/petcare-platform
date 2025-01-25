package pet.care.core.service.common;

import org.springframework.http.ResponseEntity;

import java.util.Optional;


public class Converter {

    public static ResponseEntity response(Result<?> result) {
        StatusCode statusCode = result.code();
        Integer httpStatus = StatusCodeToHttpMapper.lookup(statusCode);

        if (result.value() != null) {
            return ResponseEntity.of(Optional.of(result.value()));
        } else {
            return ResponseEntity.status(httpStatus)
                    .body(Optional.of(result.code()));
        }
    }
}
