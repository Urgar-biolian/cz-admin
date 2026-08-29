package com.cz.admin.controller;

import com.cz.admin.service.FeishuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/feishu")
public class FeishuController {
    
    @Autowired
    private FeishuService feishuService;

    /**
     * 测试飞书连接
     */
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() {
        Map<String, Object> result = feishuService.testConnection();
        return ResponseEntity.ok(result);
    }

    /**
     * 获取租户访问令牌 (代理接口)
     */
    @PostMapping("/tenant-access-token")
    public ResponseEntity<Map<String, Object>> getTenantAccessToken() {
        try {
            String token = feishuService.getTenantAccessToken();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("tenant_access_token", token);
            response.put("message", "成功获取租户访问令牌");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取令牌失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 获取考勤结果记录 - 根据日期范围获取对应天数的考勤记录
     */
    @PostMapping("/attendance/results")
    public ResponseEntity<Map<String, Object>> getAttendanceResults(
            @RequestParam String userId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        
        // 根据日期范围获取用户考勤结果，返回天数与日期范围一致的记录
        Map<String, Object> result = feishuService.getAttendanceResults(userId, startDate, endDate);
        return ResponseEntity.ok(result);
    }

    /**
     * 调试用户ID接口 - 验证用户ID是否有效
     */
    @GetMapping("/attendance/debug-user/{userId}")
    public ResponseEntity<Map<String, Object>> debugUserId(@PathVariable String userId) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 测试单天考勤数据获取，使用今天的日期
            String today = java.time.LocalDate.now().toString();
            
            result.put("userId", userId);
            result.put("testDate", today);
            result.put("message", "开始调试用户ID: " + userId);
            
            // 调用考勤结果获取方法
            Map<String, Object> attendanceResult = feishuService.getAttendanceResults(userId, today, today);
            
            result.put("attendanceResult", attendanceResult);
            result.put("debugSuccess", attendanceResult.get("success"));
            
            if (attendanceResult.get("success").equals(true)) {
                result.put("message", "用户ID验证成功，可以获取考勤数据");
            } else {
                result.put("message", "用户ID验证失败: " + attendanceResult.get("msg"));
            }
            
        } catch (Exception e) {
            result.put("debugSuccess", false);
            result.put("message", "调试过程中发生异常: " + e.getMessage());
            result.put("error", e.getClass().getSimpleName());
        }
        
        return ResponseEntity.ok(result);
    }

    /**
     * 健康检查
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "feishu-integration");
        health.put("proxy", "enabled");
        return ResponseEntity.ok(health);
    }
} 