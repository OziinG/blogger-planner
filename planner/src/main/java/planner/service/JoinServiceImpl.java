package planner.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import planner.dto.JoinDto;
import planner.entity.UserEntity;
import planner.repository.UserRepository;

@Slf4j
@Service
public class JoinServiceImpl implements JoinService {
	
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	public JoinServiceImpl(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
		this.userRepository = userRepository;
		this.bCryptPasswordEncoder = bCryptPasswordEncoder;
	}
	
	@Override
	public boolean joinProcess(JoinDto joinDto) {
		if (userRepository.existsByUsername(joinDto.getUsername()))
			return false;
		
		// JoinDto의 값을 UserEntity에 설정 
		UserEntity userEntity = new ModelMapper().map(joinDto, UserEntity.class);

		// 패스워드 암호화 처리 및 역할을 설정
		userEntity.setPassword(bCryptPasswordEncoder.encode(userEntity.getPassword()));
		userEntity.setRole("ROLE_USER");
		
		// UserEntity를 저장
		try {
			userRepository.save(userEntity);
			return true;
		} catch (Exception e) {
			return false;	
		}
	}
}
