package planner.entity;

import java.time.LocalDateTime;
import java.util.Collection;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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

    @OneToMany(mappedBy = "planner", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonManagedReference
    private Collection<PlannerFileEntity> fileInfoList;

    private String startDate;

    private String endDate;

    private String location;

    private String details;  
}
