package planner.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import planner.security.CustomAccessDeniedHandler;
import planner.security.CustomAuthenticationSuccessHandler;
import planner.security.JwtRequestFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration {

	@Autowired
	private CustomAuthenticationSuccessHandler successHandler;
	
	@Autowired
	private JwtRequestFilter jwtRequestFilter;

	@Autowired
    private CustomAccessDeniedHandler accessDeniedHandler;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.authorizeHttpRequests((auth) -> 
			auth
				.requestMatchers("/", "/login", "/home", "/join", "/joinProc").permitAll()
				.requestMatchers("/admin").hasRole("ADMIN")
				.requestMatchers("/planner/**", "/api/**").hasAnyRole("ADMIN", "USER")
				.anyRequest().authenticated())
		
		.formLogin((auth) -> 
			auth
				.loginPage("/login")
				.loginProcessingUrl("/loginProc").permitAll()
				.successHandler(successHandler))
		
		.logout((auth) -> 
			auth
				.logoutUrl("/logout"))
		
		.exceptionHandling((exceptionHandling) -> 
			exceptionHandling
				.accessDeniedHandler(accessDeniedHandler)); // 커스텀 AccessDeniedHandler 설정

		http
	 	.csrf((auth) -> auth.disable());
		
		http.sessionManagement((auth) -> 
			auth
				.sessionFixation((sessionFixation) -> 
					sessionFixation
						.newSession()
						.maximumSessions(1)
						.maxSessionsPreventsLogin(false))
		);
		
		
		
		http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

}
