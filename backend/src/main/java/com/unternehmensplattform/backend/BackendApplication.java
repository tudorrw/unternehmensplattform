package com.unternehmensplattform.backend;

import com.unternehmensplattform.backend.entities.Role;
import com.unternehmensplattform.backend.repositories.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
//@EnableJpaAuditing
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner runner(RoleRepository roleRepository) {
		return args -> {
			if(roleRepository.findByName("Employee").isEmpty()) {
				roleRepository.save(Role.builder().name("Employee").build());
			}
			if(roleRepository.findByName("Superadmin").isEmpty()) {
				roleRepository.save(Role.builder().name("Superadmin").build());
			}
			if(roleRepository.findByName("Administrator").isEmpty()) {
				roleRepository.save(Role.builder().name("Administrator").build());
			}
		};
	}

}
