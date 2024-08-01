package planner.service;

import java.util.List;

import planner.entity.PlannerEntity;

public interface PlannerService {

	List<PlannerEntity> selectPlannerList();

	List<PlannerEntity> selectPlannerListByUser(String username);

    void insertPlanner(PlannerEntity plannerEntity) throws Exception;

	void updatePlanner(PlannerEntity plannerEntity) throws Exception;

	void deletePlanner(int plannerIdx);

	PlannerEntity selectPlannerDetail(int plannerIdx) throws Exception;


	
}
