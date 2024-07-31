package planner.controller;

import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import planner.dto.PlannerDto;
import planner.dto.PlannerListResponse;
import planner.entity.PlannerEntity;
import planner.entity.PlannerFileEntity;
import planner.service.PlannerService;

@Slf4j
@RestController
@RequestMapping("/api")
public class ApiPlannerController {

    @Autowired
    private PlannerService plannerService;

    @Operation(summary = "게시판 목록 조회", description = "등록된 게시물 목록을 조회해서 반환합니다.")
    @GetMapping("/planner")
    public List<PlannerEntity> openPlannerList() throws Exception {
        List<PlannerEntity> plannerList = plannerService.selectPlannerList();
        List<PlannerListResponse> results = new ArrayList<>();
        ModelMapper modelMapper = new ModelMapper();

        plannerList.forEach(dto -> {
            results.add(modelMapper.map(dto, PlannerListResponse.class));
        });

        return plannerService.selectPlannerList();
    }
    
    @Operation(summary = "오늘 일정 게시물 조회", description = "오늘 날짜에 시작하는 일정을 불러옵니다.")
    @GetMapping("dashboard/today")
    public List<PlannerEntity> getTodayEvents() {
        return plannerService.getTodayEvents();
    }
    
    @Operation(summary = "게시물 등록", description = "새로운 게시물을 등록합니다.")
    @PostMapping("/planner/write")
    public ResponseEntity<Void> insertPlannerApi(
            @RequestBody PlannerDto plannerDto) throws Exception {
        plannerService.insertPlanner(plannerDto); 
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @Operation(summary = "게시물 상세 조회", description = "특정 게시물의 상세 정보를 조회합니다.")
    @GetMapping("/planner/{plannerIdx}")
    public ResponseEntity<Object> openPlannerDetail(@PathVariable("plannerIdx") int plannerIdx) throws Exception {
        PlannerEntity plannerEntity = plannerService.selectPlannerDetail(plannerIdx);
        if (plannerEntity == null) {
            Map<String, String> result = new HashMap<>();
            result.put("code", HttpStatus.NOT_FOUND.toString());
            result.put("message", "일치하는 게시물이 존재하지 않습니다.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(plannerEntity);
        }
    }

    @Operation(summary = "게시물 수정", description = "기존 게시물을 수정합니다.")
    @PutMapping("/planner/{plannerIdx}")
    public ResponseEntity<Void> updatePlanner(
            @PathVariable("plannerIdx") int plannerIdx,
            @RequestBody PlannerEntity plannerEntity) throws Exception {
        plannerEntity.setPlannerIdx(plannerIdx);
        plannerService.updatePlanner(plannerEntity);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(summary = "게시물 삭제", description = "특정 게시물을 삭제합니다.")
    @DeleteMapping("/planner/{plannerIdx}")
    public ResponseEntity<Void> deletePlanner(@PathVariable("plannerIdx") int plannerIdx) throws Exception {
        plannerService.deletePlanner(plannerIdx);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "파일 다운로드", description = "특정 게시물에 첨부된 파일을 다운로드합니다.")
    @GetMapping("/planner/{plannerIdx}/files/{fileIdx}")
    public void downloadPlannerFile(
            @PathVariable("fileIdx") int fileIdx,
            @PathVariable("plannerIdx") int plannerIdx,
            HttpServletResponse response) throws Exception {
        PlannerFileEntity plannerFileEntity = plannerService.selectPlannerFileInfo(fileIdx, plannerIdx);
        if (ObjectUtils.isEmpty(plannerFileEntity)) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        try {
            Path path = Paths.get(plannerFileEntity.getStoredFilePath());
            byte[] file = Files.readAllBytes(path);

            response.setContentType("application/octet-stream");
            response.setContentLength(file.length);
            response.setHeader("Content-Disposition", "attachment; fileName=\"" + URLEncoder.encode(plannerFileEntity.getOriginalFileName(), "UTF-8") + "\";");
            response.setHeader("Content-Transfer-Encoding", "binary");

            response.getOutputStream().write(file);
            response.getOutputStream().flush();
        } catch (Exception e) {
            log.error("Error while downloading file", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } finally {
            if (response.getOutputStream() != null) {
                response.getOutputStream().close();
            }
        }
    }
}
