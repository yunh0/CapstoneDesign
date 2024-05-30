package com.hansung.InsuranceProject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class InsuranceProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(InsuranceProjectApplication.class, args);
	}

}
