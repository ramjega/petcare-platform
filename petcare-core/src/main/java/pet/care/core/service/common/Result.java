package pet.care.core.service.common;

public class Result<T> {
    private final StatusCode code;
    private final T value;

    public Result(StatusCode code, T value) {
        this.code = code;
        this.value = value;
    }

    public StatusCode code() {
        return code;
    }

    public T value() {
        return value;
    }

    public T unwrap() throws ServiceException {
        if (code.isSuccess()) {
            return value;
        } else {
            throw code.getCapture();
        }
    }

    public static <T> Result<T> of(T value) {
        if (value != null) {
            return new Result<>(TxStatusCodes.SC_SUCCESS, value);
        } else {
            return new Result<>(TxStatusCodes.SC_NOT_FOUND, null);
        }
    }

    public static <T> Result<T> of(StatusCode code) {
        return new Result<>(code, null);
    }

}
