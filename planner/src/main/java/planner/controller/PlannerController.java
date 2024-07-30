package planner.controller;

import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import planner.entity.PlannerEntity;
import planner.entity.PlannerFileEntity;
import planner.service.PlannerService;

@Slf4j
@Controller
public class PlannerController {

	@Autowired
	private PlannerService plannerService;

	@GetMapping("/planner")
	public ModelAndView openPlannerList() throws Exception {
		ModelAndView mv = new ModelAndView("/planner/plannerList");
		List<PlannerEntity> list = plannerService.selectPlannerList();
		mv.addObject("list", list);
		return mv;
	}

	@GetMapping("/planner/write")
	public String openPlannerWrite() throws Exception {
		return "/planner/plannerWrite";
	}

	@PostMapping("/planner/write")
	public String insertPlanner(PlannerEntity plannerEntity, MultipartHttpServletRequest request) throws Exception {
		plannerService.insertPlanner(plannerEntity, request);
		return "redirect:/planner";
	}

	@GetMapping("/planner/{plannerIdx}")
	public ModelAndView openPlannerDetail(@PathVariable("plannerIdx") int plannerIdx) throws Exception {
		ModelAndView mv = new ModelAndView("planner/plannerDetail");
		PlannerEntity plannerEntity = plannerService.selectPlannerDetail(plannerIdx);
		mv.addObject("planner", plannerEntity);
		return mv;
	}

	@PutMapping("/planner/{plannerIdx}")
	public String updatePlanner(@PathVariable("plannerIdx") int plannerIdx, PlannerEntity plannerEntity,
			MultipartHttpServletRequest request) throws Exception {
		plannerEntity.setPlannerIdx(plannerIdx);
		plannerService.updatePlanner(plannerEntity, request);
		return "redirect:/planner";
	}

	@DeleteMapping("/planner/{plannerIdx}")
	public String deletePlanner(@PathVariable("plannerIdx") int plannerIdx) throws Exception {
		plannerService.deletePlanner(plannerIdx);
		return "redirect:/planner";
	}

	@GetMapping("/planner/file/{plannerIdx}/{idx}")
	public void downloadPlannerFile(@PathVariable("idx") int idx, @PathVariable("plannerIdx") int plannerIdx,
			HttpServletResponse response) throws Exception {
		PlannerFileEntity plannerFileEntity = plannerService.selectPlannerFileInfo(idx, plannerIdx);
		if (ObjectUtils.isEmpty(plannerFileEntity)) {
			return;
		}

		Path path = Paths.get(plannerFileEntity.getStoredFilePath());
		byte[] file = Files.readAllBytes(path);

		response.setContentType("application/octet-stream");
		response.setContentLength(file.length);
		response.setHeader("Content-Disposition", "attachment; fileName=\""
				+ URLEncoder.encode(plannerFileEntity.getOriginalFileName(), "UTF-8") + "\";");
		response.setHeader("Content-Transfer-Encoding", "binary");

		response.getOutputStream().write(file);
		response.getOutputStream().flush();
		response.getOutputStream().close();
	}
}
