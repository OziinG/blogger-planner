package planner.dto;

import lombok.Data;

@Data
public class PlannerListResponse {
	private int plannerIdx;
	private String title;
	private int hitCnt;
	private String createdDatetime;
}
