package pet.care.core.domain.entity;

import pet.care.core.service.endpoint.auth.SecurityHolder;
import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

@Data
@MappedSuperclass
public abstract class ResourceEntity implements Serializable {

    public abstract Long getId();

    // pre-update
    protected Timestamp createdTime;

    protected Timestamp modifiedTime;

    protected Long createdByUserId;

    protected Long modifiedByUserId;

    @PrePersist
    private void setMetaFieldsOnCreate(){
        this.createdTime = new Timestamp(System.currentTimeMillis());
        this.createdByUserId = SecurityHolder.getProfileId();
    }

    @PreUpdate
    public void setMetaFieldsOnUpdate(){
       this.modifiedTime = new Timestamp(System.currentTimeMillis());
        this.modifiedByUserId = SecurityHolder.getProfileId();
    }

}
