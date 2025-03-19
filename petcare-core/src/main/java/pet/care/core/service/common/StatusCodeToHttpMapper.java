package pet.care.core.service.common;

import java.util.HashMap;
import java.util.Map;

class StatusCodeToHttpMapper {
    private static final Map<String, Integer> CODE_MAP = new HashMap<>();

    static {
        CODE_MAP.put(TxStatusCodes.SC_SUCCESS.code(), 200);
        CODE_MAP.put(TxStatusCodes.SC_BAD_REQUEST.code(), 400);
        CODE_MAP.put(TxStatusCodes.SC_VALIDATION_FAILED.code(), 400);
        CODE_MAP.put(TxStatusCodes.SC_NOT_AUTHORIZED.code(), 401);
        CODE_MAP.put(TxStatusCodes.SC_NOT_FOUND.code(), 404);
        CODE_MAP.put(TxStatusCodes.SC_INTERNAL_ERROR.code(), 500);
    }

    static Integer lookup(StatusCode code) {
        return CODE_MAP.getOrDefault(code.code(), 500);
    }
}
