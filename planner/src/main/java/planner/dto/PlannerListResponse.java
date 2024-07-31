package planner.dto;

import lombok.Data;

@Data
public class PlannerListResponse {
	private int plannerIdx;
	private String title;
	private String location;
	private int hitCnt;
	private String createdDatetime;
}
