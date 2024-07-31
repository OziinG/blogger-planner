package planner.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;
import planner.common.FileUtils;
import planner.dto.PlannerDto;
import planner.entity.PlannerEntity;
import planner.entity.PlannerFileEntity;
import planner.repository.PlannerRepository;

@Slf4j
@Transactional
@Service
public class PlannerServiceImpl implements PlannerService {

    @Autowired
    private PlannerRepository plannerRepository;

    @Autowired
    private FileUtils fileUtils;

    @Override
    public List<PlannerEntity> getTodayEvents() {
        LocalDate today = LocalDate.now();
        return plannerRepository.findByStartDate(today.toString());
    }
    @Override
    public List<PlannerEntity> selectPlannerList() {
        return plannerRepository.findAllByOrderByPlannerIdxDesc();
    }

    @Override
    public List<PlannerEntity> selectPlannerListByUser(String username) {
        return plannerRepository.findByCreatorIdOrderByPlannerIdxDesc(username);
    }

    @Override
    public void insertPlanner(PlannerDto plannerDto) throws Exception {
        PlannerEntity plannerEntity = new ModelMapper().map(plannerDto, PlannerEntity.class);
        

        plannerEntity.setCreatorId(plannerDto.getCreatorId());
        plannerRepository.save(plannerEntity);
    }

    
    @Override
    public void updatePlanner(PlannerEntity plannerEntity) throws Exception {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        PlannerEntity existingPlanner = plannerRepository.findById(plannerEntity.getPlannerIdx())
                .orElseThrow(() -> new Exception("일치하는 데이터가 없음"));

        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!username.equals(existingPlanner.getCreatorId()) && !isAdmin) {
            throw new AccessDeniedException("You do not have permission to update this planner");
        }

        existingPlanner.setTitle(plannerEntity.getTitle());
        existingPlanner.setContents(plannerEntity.getContents());
        existingPlanner.setStartDate(plannerEntity.getStartDate());
        existingPlanner.setEndDate(plannerEntity.getEndDate());
        existingPlanner.setLocation(plannerEntity.getLocation());
        existingPlanner.setDetails(plannerEntity.getDetails());


        existingPlanner.setUpdatorId(username);
        existingPlanner.setUpdatedDatetime(LocalDateTime.now());

        plannerRepository.save(existingPlanner);
    }

    @Override
    public void deletePlanner(int plannerIdx) {
        plannerRepository.deleteById(plannerIdx);
    }

    @Override
    public PlannerFileEntity selectPlannerFileInfo(int idx, int plannerIdx) {
        return plannerRepository.findPlannerFile(idx, plannerIdx);
    }

    @Override
    public PlannerEntity selectPlannerDetail(int plannerIdx) throws Exception {
        Optional<PlannerEntity> optional = plannerRepository.findById(plannerIdx);
        if (optional.isPresent()) {
            PlannerEntity plannerEntity = optional.get();
            plannerEntity.setHitCnt(plannerEntity.getHitCnt() + 1);
            plannerRepository.save(plannerEntity);
            return plannerEntity;
        } else {
            throw new Exception("일치하는 데이터가 없음");
        }
    }
}
