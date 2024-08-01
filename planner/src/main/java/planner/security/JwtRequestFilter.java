package planner.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import planner.common.JwtUtils;
import planner.dto.CustomUserDetail;
import planner.entity.UserEntity;
import planner.repository.UserRepository;

@Component
@Slf4j
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository repository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String uri = request.getRequestURI();
        if ( uri.equals("/") || uri.equals("/login") || uri.equals("/loginProc") || uri.equals("/join") || uri.equals("/joinProc") ) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwtToken = null;
        String subject = null;

        String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwtToken = authorizationHeader.substring(7); // "Bearer " 이후의 모든 내용
            subject = jwtUtils.getSubjectFromToken(jwtToken);
            log.debug("JWT token: {}", jwtToken);
            log.debug("Subject from token: {}", subject);
        } else {
            log.error("AUTHORIZATION 헤더 누락 또는 토큰 형식 오류");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid JWT token");
            response.getWriter().flush();
            return;
        }

        if (subject != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserEntity userEntity = repository.findByUsername(subject);
            if (jwtUtils.validateToken(jwtToken, userEntity)) {
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userEntity, null,  new CustomUserDetail(userEntity).getAuthorities());
                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            } else {
                SecurityContextHolder.getContext().setAuthentication(null);
            }
        }

        filterChain.doFilter(request, response);
    }

}
