package com.gmart.dmartweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@EnableEurekaClient
@SpringBootApplication
public class DmartWebApplication {

	public static void main(String[] args) {
		SpringApplication.run(DmartWebApplication.class, args);
	}

}
