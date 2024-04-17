package com.hansung.InsuranceProject.config;

import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final JWTRequestFilter jwtRequestFilter;

    public SecurityConfig(JWTRequestFilter jwtRequestFilter) {
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors();
        http.csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .ignoringAntMatchers("/api/oauth/login")
                .ignoringAntMatchers("/api/insurance/terms")
                .ignoringAntMatchers("/api/user/chatrooms")
                .ignoringAntMatchers("/api/user/chatroom/**")
                .ignoringAntMatchers("/api/user/message/**")
                .ignoringAntMatchers("/api/savePin/**")
                .ignoringAntMatchers("/api/getPin")
                .ignoringAntMatchers("/api/deletePin/**")
                .ignoringAntMatchers("/api/freCo");
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        http.authorizeRequests()
                .antMatchers("/api/oauth/login").permitAll()
                .antMatchers("api/insurance/terms").permitAll()
                .antMatchers("/api/user/chatrooms").permitAll()
                .antMatchers("/api/user/chatroom/**").permitAll()
                .antMatchers("/api/user/message/**").permitAll()
                .antMatchers("/api/savePin/**").permitAll()
                .antMatchers("/api/getPin").permitAll()
                .antMatchers("/api/deletePin/**").permitAll()
                .antMatchers("/api/freCo").permitAll()
                .anyRequest().authenticated();
    }
}