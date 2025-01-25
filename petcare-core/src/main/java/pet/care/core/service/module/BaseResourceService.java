package pet.care.core.service.module;

import pet.care.core.domain.entity.ResourceEntity;
import pet.care.core.repo.JsonSerializationCodec;
import pet.care.core.service.common.ResourcePatch;
import pet.care.core.service.common.Result;
import com.fasterxml.jackson.databind.JsonNode;
import com.flipkart.zjsonpatch.JsonPatch;
import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import pet.care.core.service.common.StatusCode;
import pet.care.core.service.common.TxStatusCodes;

import java.util.List;
import java.util.Optional;

@Transactional(rollbackFor = {Exception.class})
public abstract class BaseResourceService<T extends ResourceEntity> implements ResourceService<T> {

    protected JsonSerializationCodec codec;
    protected final Class<T> resourceType;
    protected JpaRepository<T, Long> repo;


    public BaseResourceService(ApplicationContext ctx, Class<T> type, JpaRepository<T, Long> repo) {
        this.codec = ctx.getBean(JsonSerializationCodec.class);
        this.resourceType = type;
        this.repo = repo;
    }

    @Override
    public Class<T> type() {
        return resourceType;
    }

    @Override
    public Result<T> create(T value) {
        if (value.getId() != null) {
            return Result.of(StatusCode.sc(TxStatusCodes.SC_VALIDATION_FAILED, "Field Id cannot be provided on create!"));
        }

        return Result.of(repo.save(value));
    }

    @Override
    public List<T> query() {
        return repo.findAll();
    }

    @Override
    public Optional<T> findById(Long id) {
        return repo.findById(id);
    }

    @Override
    public Result<T> update(T value) {

        if (value.getId() == null) {
            return Result.of(StatusCode.sc(TxStatusCodes.SC_BAD_REQUEST, "Field id cannot be null"));
        }
        
        Optional<T> existing = repo.findById(value.getId());

        if (existing.isPresent()) {
            return Result.of(repo.save(value));
        } else {
            return Result.of(StatusCode.sc(TxStatusCodes.SC_NOT_FOUND, type().getSimpleName() + " for id [" + value.getId() + "] not found"));
        }
    }

    @Override
    public Result<T> patch(Long id, List<ResourcePatch> patches) {
        Optional<T> existing = repo.findById(id);
        if (existing.isPresent()) {
            T value = existing.get();

            JsonNode sourceNode = codec.writeObjectToNode(value);
            JsonNode patchNode = codec.writeObjectToNode(patches);

            JsonPatch.applyInPlace(patchNode, sourceNode);

            T patchedValue = codec.readFromNode(sourceNode, type());

            return update(patchedValue);
        } else {
            return Result.of(StatusCode.sc(TxStatusCodes.SC_NOT_FOUND, type().getSimpleName() + " for id [" + id + "] not found"));
        }
    }

    @Override
    public Result<T> delete(Long id) {
        Optional<T> existing = repo.findById(id);

        if (existing.isPresent()) {
            repo.deleteById(id);
            return Result.of(existing.get());
        } else {
            return Result.of(StatusCode.sc(TxStatusCodes.SC_NOT_FOUND, type().getSimpleName() + "not found for id [" + id + "]"));
        }
    }
}
