package planner.dto;

import lombok.Data;

@Data
public class PlannerInsertRequest {
	private String title;
	private String contents;
}
