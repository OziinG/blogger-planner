package planner.service;

import java.util.List;

import org.springframework.web.multipart.MultipartHttpServletRequest;

import planner.entity.PlannerEntity;
import planner.entity.PlannerFileEntity;

public interface PlannerService {

	List<PlannerEntity> selectPlannerList();

	List<PlannerEntity> selectPlannerListByUser(String username);

	void insertPlanner(PlannerEntity plannerEntity, MultipartHttpServletRequest request) throws Exception;

	void updatePlanner(PlannerEntity plannerEntity, MultipartHttpServletRequest request) throws Exception;

	void deletePlanner(int plannerIdx);

	PlannerFileEntity selectPlannerFileInfo(int idx, int plannerIdx);

	PlannerEntity selectPlannerDetail(int plannerIdx) throws Exception;
}
