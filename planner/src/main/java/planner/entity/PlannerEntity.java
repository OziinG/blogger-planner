package planner.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "t_jpa_planner")
@NoArgsConstructor
@Data
public class PlannerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int plannerIdx;

    @Column(nullable = false)
    private String title;

    @Column(nullable = true)
    private String contents;  // 요약 설명

    @Column(nullable = false)
    private int hitCnt = 0;

    @Column(nullable = false)
    private LocalDateTime createdDatetime = LocalDateTime.now();

    @Column(nullable = false)
    private String creatorId;

    private LocalDateTime updatedDatetime;

    private String updatorId;

    private String startDate;

    private String endDate;

    private String location;

    private String details;  
}
