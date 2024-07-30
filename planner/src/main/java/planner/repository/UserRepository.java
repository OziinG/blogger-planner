package planner.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import planner.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
	// username 중복 여부를 검사하는 쿼리 메서드
	boolean existsByUsername(String username);
	UserEntity findByUsername(String username);

}
