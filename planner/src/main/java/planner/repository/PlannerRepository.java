package planner.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import planner.entity.PlannerEntity;

public interface PlannerRepository extends JpaRepository<PlannerEntity, Integer> {

    List<PlannerEntity> findAllByOrderByPlannerIdxDesc();

    List<PlannerEntity> findByCreatorIdOrderByPlannerIdxDesc(String creatorId);

    List<PlannerEntity> findByStartDate(String startDate);

}
