package planner.dto;

import lombok.Data;

@Data
public class JoinDto {
	private String username;
	private String password;		// 패스워드 
	private String passwordConfirm;	// 패스워드 확인
	private String name;
	private String email;

	public boolean checkPassword() {
		return this.password != null && this.password.equals(this.passwordConfirm);
	}
}
