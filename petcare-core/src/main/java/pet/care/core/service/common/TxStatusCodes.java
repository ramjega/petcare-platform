package pet.care.core.service.common;

public interface TxStatusCodes {
    StatusCode SC_SUCCESS = new StatusCode("S1000", "Success");
    StatusCode SC_NOT_FOUND = new StatusCode("E1010", "Not found");
    StatusCode SC_ALREADY_EXIST = new StatusCode("E1011", "Already exist");
    StatusCode SC_INTERNAL_ERROR = new StatusCode("E1012", "Internal Error");
    StatusCode SC_BAD_REQUEST = new StatusCode("E1013", "Bad request");
    StatusCode SC_NOT_AUTHORIZED = new StatusCode("E1014", "Not Authorized");
    StatusCode SC_VALIDATION_FAILED = new StatusCode("E1015", "Validation failed");
}
