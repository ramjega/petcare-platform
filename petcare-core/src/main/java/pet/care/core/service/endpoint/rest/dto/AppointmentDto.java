package pet.care.core.service.endpoint.rest.dto;

import lombok.Data;
import pet.care.core.domain.type.Speciality;
import pet.care.core.service.util.TimeUtils;

@Data
public class AppointmentDto {
    private Long sessionId;
    private Long petId;
    private String note;
}
