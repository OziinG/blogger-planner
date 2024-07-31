package planner.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import planner.dto.JoinDto;
import planner.service.JoinService;

@Controller
public class JoinController {
    @Autowired
    JoinService joinService;
    
    @GetMapping("/join")
	public String join() {
		return "/join";
	}
	
	@PostMapping("/joinProc")
	public String joinProc(JoinDto joinDto) {
		if (joinService.joinProcess(joinDto)) {
			return "redirect:/login";
		} else {
			return "redirect:/join";
		}
	}
}
