package planner.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import planner.common.JwtUtils;
import planner.entity.UserEntity;
import planner.repository.UserRepository;

@Slf4j
@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private JwtUtils jwtUtils;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		UserDetails userDetails = (UserDetails) authentication.getPrincipal();
		UserEntity userEntity = userRepository.findByUsername(userDetails.getUsername());

		String jwtToken = jwtUtils.generateToken(userEntity);
		log.debug(jwtToken);

		// 세션에 사용자 정보를 저장
		request.getSession().setAttribute("user", userEntity);

		// 응답 헤더에 생성한 토큰을 설정
		response.setHeader("token", jwtToken);
		
		// 토큰을 JSON 형태로 응답
		response.setContentType("application/json");
		response.getWriter().write("{\"token\": \"" + jwtToken + "\"}");
		response.getWriter().flush();
	}
}
