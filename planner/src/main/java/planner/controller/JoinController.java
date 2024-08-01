package planner.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import planner.dto.JoinDto;
import planner.service.JoinService;

@RestController
public class JoinController {
	
    @Autowired
    JoinService joinService;
    
    @GetMapping("/join")
	public String join() {
		return "/join";
	}
	
    @PostMapping("/joinProc")
    public String joinProc(@RequestBody JoinDto joinDto) {
        if (joinService.joinProcess(joinDto)) {
            return "redirect:/";
        } else {
            return "redirect:/login";
        }
    }

}
