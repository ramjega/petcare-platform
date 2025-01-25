package pet.care.core.service.common;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Objects;

public final class StatusCode {

    private final String code;
    private final String error;
    private final boolean isSuccess;
    private final ServiceException capture;

    public StatusCode(String code, String error) {
        this.code = code;
        this.error = error;
        this.isSuccess = "S1000".equals(code);
        if (!isSuccess) {
            this.capture = new ServiceException(this);
        } else {
            this.capture = null;
        }
    }

    public static StatusCode sc(StatusCode sc, String desc) {
        return new StatusCode(sc.code(), desc);
    }

    @JsonProperty
    public String code() {
        return code;
    }

    @JsonProperty
    public String error() {
        return error;
    }

    @JsonIgnore
    public boolean isSuccess() {
        return isSuccess;
    }

    @JsonIgnore
    public boolean isFailure() {
        return !isSuccess();
    }

    @JsonIgnore
    public ServiceException getCapture() {
        return capture;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof StatusCode)) return false;
        StatusCode that = (StatusCode) o;
        return Objects.equals(code, that.code);
    }

    @Override
    public int hashCode() {
        return Objects.hash(code);
    }

    @Override
    public String toString() {
        return "StatusCode{" +
                "code='" + code + '\'' +
                ", error='" + error + '\'' +
                '}';
    }
}
