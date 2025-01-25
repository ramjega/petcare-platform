package pet.care.core.repo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RepoModule {

    @Bean
    public JsonSerializationCodec serializationCodec() {
        return new JsonSerializationCodec();
    }

}
