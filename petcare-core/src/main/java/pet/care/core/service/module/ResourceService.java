package pet.care.core.service.module;

import pet.care.core.domain.entity.ResourceEntity;
import pet.care.core.service.common.ResourcePatch;
import pet.care.core.service.common.Result;

import java.util.List;
import java.util.Optional;

public interface ResourceService<T extends ResourceEntity> {

    Class<T> type();

    Result<T> create(T value);

    List<T> query();

    Optional<T> findById(Long id);

    Result<T> update(T value);

    Result<T> patch(Long id, List<ResourcePatch> patches);

    Result<T> delete(Long id);
}
