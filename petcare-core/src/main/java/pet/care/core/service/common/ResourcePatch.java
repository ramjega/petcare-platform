package pet.care.core.service.common;

import io.leangen.graphql.annotations.GraphQLScalar;
import io.leangen.graphql.annotations.types.GraphQLType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ResourcePatch {
    private String path;

    private Op op;

    public enum Op {
        add,
        remove,
        replace,
        copy,
        move,
        test
    }

    private String from;

    @GraphQLScalar
    private Object value;

}
