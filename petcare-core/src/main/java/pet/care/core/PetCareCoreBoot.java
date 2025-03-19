package pet.care.core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PetCareCoreBoot {

    public static void main(String[] args) {
        SpringApplication.run(PetCareCoreBoot.class, args);
        System.out.println("Petcare core has started successfully!");
    }
}
