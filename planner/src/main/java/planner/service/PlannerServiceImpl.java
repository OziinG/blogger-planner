package planner.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import lombok.extern.slf4j.Slf4j;
import planner.common.FileUtils;
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
    public List<PlannerEntity> selectPlannerList() {
        return plannerRepository.findAllByOrderByPlannerIdxDesc();
    }

    @Override
    public List<PlannerEntity> selectPlannerListByUser(String username) {
        return plannerRepository.findByCreatorIdOrderByPlannerIdxDesc(username);
    }

    @Override
    public void insertPlanner(PlannerEntity plannerEntity, MultipartHttpServletRequest request) throws Exception {
        addFilesToPlanner(plannerEntity, request);
        plannerEntity.setCreatorId(getAuthenticatedUsername());
        plannerRepository.save(plannerEntity);
    }

    @Override
    public void updatePlanner(PlannerEntity plannerEntity, MultipartHttpServletRequest request) throws Exception {
        PlannerEntity existingPlanner = getExistingPlanner(plannerEntity.getPlannerIdx());
        validateUserPermission(existingPlanner);

        updatePlannerDetails(existingPlanner, plannerEntity);
        addFilesToPlanner(existingPlanner, request);

        existingPlanner.setUpdatorId(getAuthenticatedUsername());
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

    private void addFilesToPlanner(PlannerEntity plannerEntity, MultipartHttpServletRequest request) throws Exception {
        List<PlannerFileEntity> list = fileUtils.parseFileInfo(request);
        if (list != null) {
            for (PlannerFileEntity file : list) {
                file.setPlanner(plannerEntity);
            }
            plannerEntity.setFileInfoList(list);
        }
    }

    private PlannerEntity getExistingPlanner(int plannerIdx) throws Exception {
        return plannerRepository.findById(plannerIdx)
                .orElseThrow(() -> new Exception("일치하는 데이터가 없음"));
    }

    private void validateUserPermission(PlannerEntity plannerEntity) {
        String username = getAuthenticatedUsername();
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!username.equals(plannerEntity.getCreatorId()) && !isAdmin) {
            throw new AccessDeniedException("You do not have permission to update this planner");
        }
    }

    private void updatePlannerDetails(PlannerEntity existingPlanner, PlannerEntity updatedPlanner) {
        existingPlanner.setTitle(updatedPlanner.getTitle());
        existingPlanner.setContents(updatedPlanner.getContents());
        existingPlanner.setStartDate(updatedPlanner.getStartDate());
        existingPlanner.setEndDate(updatedPlanner.getEndDate());
        existingPlanner.setLocation(updatedPlanner.getLocation());
        existingPlanner.setDetails(updatedPlanner.getDetails());
    }

    private String getAuthenticatedUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
