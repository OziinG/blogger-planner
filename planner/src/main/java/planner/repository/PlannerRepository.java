package planner.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import planner.entity.PlannerEntity;
import planner.entity.PlannerFileEntity;

public interface PlannerRepository extends JpaRepository<PlannerEntity, Integer> {

    List<PlannerEntity> findAllByOrderByPlannerIdxDesc();

    List<PlannerEntity> findByCreatorIdOrderByPlannerIdxDesc(String creatorId);

    @Query("SELECT file FROM PlannerFileEntity file WHERE file.idx = :idx AND file.planner.plannerIdx = :plannerIdx")
    public PlannerFileEntity findPlannerFile(@Param("idx") int idx, @Param("plannerIdx") int plannerIdx);

}
