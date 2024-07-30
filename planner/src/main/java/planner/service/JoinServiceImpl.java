package planner.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import planner.dto.JoinDto;
import planner.entity.UserEntity;
import planner.repository.UserRepository;

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
		// 동일한 username을 사용하고 있는지 확인
		if (userRepository.existsByUsername(joinDto.getUsername()))
			return false;
		
		// 패스워드와 패스워드 확인이 일치하는지 확인
		if (!joinDto.checkPassword())
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

	
