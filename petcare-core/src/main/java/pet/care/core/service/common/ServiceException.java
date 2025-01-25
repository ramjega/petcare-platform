package pet.care.core.service.common;

public class ServiceException extends RuntimeException {
    private StatusCode statusCode;

    public ServiceException(StatusCode statusCode) {
        this.statusCode = statusCode;
    }

    public ServiceException(Throwable cause, StatusCode statusCode) {
        super(cause);
        this.statusCode = statusCode;
    }

    public StatusCode getStatusCode() {
        return statusCode;
    }

    @Override
    public String getMessage() {
        return statusCode.code() + ":" + statusCode.error();
    }
}
