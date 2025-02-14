package pet.care.core.service.endpoint.rest.dto;

import lombok.Data;
import pet.care.core.domain.type.Speciality;
import pet.care.core.service.util.TimeUtils;

@Data
public class SessionSearchDto {
    private Long from = TimeUtils.currentUtcTime();
    private Long to = TimeUtils.currentUtcTime();;
    private Long professionalId;
    private Speciality speciality;
    private Long organizationId;
    private Long cityId;
}
