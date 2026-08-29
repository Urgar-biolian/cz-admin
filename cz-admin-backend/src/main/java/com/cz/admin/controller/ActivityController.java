package com.cz.admin.controller;

import com.cz.admin.dto.CreateActivityDto;
import com.cz.admin.dto.UpdateActivityDto;
import com.cz.admin.entity.Activity;
import com.cz.admin.service.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 活动管理控制器
 * 提供活动的 CRUD 操作 API
 */
@RestController
@RequestMapping("/activity")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ActivityController {
    
    private final ActivityService activityService;
    
    /**
     * 获取所有活动
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllActivities() {
        log.info("获取所有活动列表");
        
        try {
            List<Activity> activities = activityService.findAll();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("code", 200);
            response.put("message", "获取活动列表成功");
            response.put("data", activities);
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("获取活动列表失败", e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("code", 500);
            response.put("message", "获取活动列表失败: " + e.getMessage());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 根据ID获取活动
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getActivityById(@PathVariable Long id) {
        log.info("根据ID获取活动: {}", id);
        
        try {
            return activityService.findById(id)
                    .map(activity -> {
                        Map<String, Object> response = new HashMap<>();
                        response.put("success", true);
                        response.put("code", 200);
                        response.put("message", "获取活动详情成功");
                        response.put("data", activity);
                        response.put("timestamp", System.currentTimeMillis());
                        
                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> {
                        Map<String, Object> response = new HashMap<>();
                        response.put("success", false);
                        response.put("code", 404);
                        response.put("message", "活动不存在");
                        response.put("timestamp", System.currentTimeMillis());
                        
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                    });
        } catch (Exception e) {
            log.error("获取活动详情失败", e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("code", 500);
            response.put("message", "获取活动详情失败: " + e.getMessage());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 创建新活动
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createActivity(@Valid @RequestBody CreateActivityDto createActivityDto) {
        log.info("创建新活动: {}", createActivityDto.getIntro());
        
        try {
            Activity createdActivity = activityService.create(createActivityDto);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("code", 201);
            response.put("message", "活动创建成功");
            response.put("data", createdActivity);
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("创建活动失败", e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("code", 500);
            response.put("message", "创建活动失败: " + e.getMessage());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 更新活动
     */
    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateActivity(
            @PathVariable Long id, 
            @RequestBody UpdateActivityDto updateActivityDto) {
        log.info("更新活动: {}", id);
        
        try {
            return activityService.update(id, updateActivityDto)
                    .map(updatedActivity -> {
                        Map<String, Object> response = new HashMap<>();
                        response.put("success", true);
                        response.put("code", 200);
                        response.put("message", "活动更新成功");
                        response.put("data", updatedActivity);
                        response.put("timestamp", System.currentTimeMillis());
                        
                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> {
                        Map<String, Object> response = new HashMap<>();
                        response.put("success", false);
                        response.put("code", 404);
                        response.put("message", "活动不存在");
                        response.put("timestamp", System.currentTimeMillis());
                        
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                    });
        } catch (Exception e) {
            log.error("更新活动失败", e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("code", 500);
            response.put("message", "更新活动失败: " + e.getMessage());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 删除活动
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteActivity(@PathVariable Long id) {
        log.info("删除活动: {}", id);
        
        try {
            boolean deleted = activityService.delete(id);
            
            if (deleted) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("code", 200);
                response.put("message", "活动删除成功");
                response.put("timestamp", System.currentTimeMillis());
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("code", 404);
                response.put("message", "活动不存在");
                response.put("timestamp", System.currentTimeMillis());
                
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            log.error("删除活动失败", e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("code", 500);
            response.put("message", "删除活动失败: " + e.getMessage());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 根据状态获取活动
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<Map<String, Object>> getActivitiesByStatus(@PathVariable Integer status) {
        log.info("根据状态获取活动: {}", status);
        
        try {
            List<Activity> activities = activityService.findByStatus(status);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("code", 200);
            response.put("message", "获取活动列表成功");
            response.put("data", activities);
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("根据状态获取活动失败", e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("code", 500);
            response.put("message", "获取活动列表失败: " + e.getMessage());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}