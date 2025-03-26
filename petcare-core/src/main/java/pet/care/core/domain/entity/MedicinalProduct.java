package pet.care.core.domain.entity;


import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import pet.care.core.domain.type.MedicationPackageType;
import pet.care.core.domain.type.MedicationType;

import javax.persistence.*;

@Data
@Entity
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Table(indexes = {
        @Index(columnList = "medicineName")
})

public class MedicinalProduct extends ResourceEntity {
    @Id
    @GeneratedValue(generator = "medicinalProduct_id_generator")
    protected Long id;

    private String medicineName;
    private String brandName;
    private MedicationType type;

}
