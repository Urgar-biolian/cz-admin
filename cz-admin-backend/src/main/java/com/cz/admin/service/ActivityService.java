package com.cz.admin.service;

import com.cz.admin.dto.CreateActivityDto;
import com.cz.admin.dto.UpdateActivityDto;
import com.cz.admin.entity.Activity;
import com.cz.admin.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 活动业务逻辑层
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ActivityService {
    
    private final ActivityRepository activityRepository;
    
    /**
     * 获取所有活动，按创建时间倒序
     */
    @Transactional(readOnly = true)
    public List<Activity> findAll() {
        log.info("获取所有活动列表");
        return activityRepository.findAllOrderByCreatedAtDesc();
    }
    
    /**
     * 根据ID获取活动
     */
    @Transactional(readOnly = true)
    public Optional<Activity> findById(Long id) {
        log.info("根据ID获取活动: {}", id);
        return activityRepository.findById(id);
    }
    
    /**
     * 创建新活动
     */
    public Activity create(CreateActivityDto createActivityDto) {
        log.info("创建新活动: {}", createActivityDto.getIntro());
        
        Activity activity = new Activity();
        BeanUtils.copyProperties(createActivityDto, activity);
        
        Activity savedActivity = activityRepository.save(activity);
        log.info("活动创建成功，ID: {}", savedActivity.getId());
        
        return savedActivity;
    }
    
    /**
     * 更新活动
     */
    public Optional<Activity> update(Long id, UpdateActivityDto updateActivityDto) {
        log.info("更新活动: {}", id);
        
        return activityRepository.findById(id)
                .map(existingActivity -> {
                    // 只更新非空字段
                    if (updateActivityDto.getIntro() != null) {
                        existingActivity.setIntro(updateActivityDto.getIntro());
                    }
                    if (updateActivityDto.getDetail() != null) {
                        existingActivity.setDetail(updateActivityDto.getDetail());
                    }
                    if (updateActivityDto.getSdate() != null) {
                        existingActivity.setSdate(updateActivityDto.getSdate());
                    }
                    if (updateActivityDto.getEdate() != null) {
                        existingActivity.setEdate(updateActivityDto.getEdate());
                    }
                    if (updateActivityDto.getJoiners() != null) {
                        existingActivity.setJoiners(updateActivityDto.getJoiners());
                    }
                    if (updateActivityDto.getStatus() != null) {
                        existingActivity.setStatus(updateActivityDto.getStatus());
                    }
                    
                    Activity updatedActivity = activityRepository.save(existingActivity);
                    log.info("活动更新成功: {}", updatedActivity.getId());
                    
                    return updatedActivity;
                });
    }
    
    /**
     * 删除活动
     */
    public boolean delete(Long id) {
        log.info("删除活动: {}", id);
        
        if (activityRepository.existsById(id)) {
            activityRepository.deleteById(id);
            log.info("活动删除成功: {}", id);
            return true;
        } else {
            log.warn("活动不存在: {}", id);
            return false;
        }
    }
    
    /**
     * 根据状态获取活动
     */
    @Transactional(readOnly = true)
    public List<Activity> findByStatus(Integer status) {
        log.info("根据状态获取活动: {}", status);
        return activityRepository.findByStatusOrderByCreatedAtDesc(status);
    }
    
    /**
     * 根据日期范围获取活动
     */
    @Transactional(readOnly = true)
    public List<Activity> findByDateRange(String startDate, String endDate) {
        log.info("根据日期范围获取活动: {} - {}", startDate, endDate);
        return activityRepository.findByDateRange(startDate, endDate);
    }
}