package planner.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class PlannerDto {
    private int plannerIdx;
    private String title;
    private String contents;  // 요약 설명
    private int hitCnt = 0;
    private LocalDateTime createdDatetime= LocalDateTime.now();
    private String creatorId;
    private LocalDateTime updatedDatetime;
    private String updatorId;
	private List<PlannerFileDto> fileInfoList;

    private String startDate;
    private String endDate;
    private String location;
    private String details;  
}
