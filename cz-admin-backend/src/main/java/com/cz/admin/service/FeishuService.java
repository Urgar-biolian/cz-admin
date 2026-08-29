package com.cz.admin.service;

import com.cz.admin.config.FeishuConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.google.gson.JsonParser;
import com.lark.oapi.Client;
import com.lark.oapi.core.utils.Jsons;
import com.lark.oapi.service.attendance.v1.model.*;
import java.util.HashMap;
import com.lark.oapi.core.request.RequestOptions;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class FeishuService {
    
    @Autowired
    private FeishuConfig feishuConfig;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final Gson gson = new Gson();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // 缓存的租户访问令牌
    private String cachedTenantAccessToken;
    private long tokenExpireTime;
    
    /**
     * 创建通用的HTTP请求头
     */
    private HttpHeaders createHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (token != null) {
            headers.setBearerAuth(token);
        }
        return headers;
    }
    
    /**
     * 处理API响应
     */
    private Map<String, Object> handleApiResponse(ResponseEntity<String> response, String operation) {
        Map<String, Object> result = new HashMap<>();
        
        if (response.getStatusCode() == HttpStatus.OK) {
            try {
                JsonNode responseNode = objectMapper.readTree(response.getBody());
                int code = responseNode.get("code").asInt();
                
                if (code == 0) {
                    result.put("success", true);
                    result.put("data", responseNode.get("data"));
                    result.put("message", operation + "成功");
                } else {
                    result.put("success", false);
                    result.put("message", operation + "失败: " + responseNode.get("msg").asText());
                    result.put("code", code);
                }
            } catch (Exception e) {
                result.put("success", false);
                result.put("message", operation + "失败: JSON解析错误");
                result.put("error_type", "JsonParseError");
            }
        } else {
            result.put("success", false);
            result.put("message", operation + "失败: HTTP " + response.getStatusCode());
        }
        
        return result;
    }
    
    /**
     * 处理异常
     */
    private Map<String, Object> handleException(Exception e, String operation) {
        log.error(operation + "异常", e);
        Map<String, Object> result = new HashMap<>();
        result.put("success", false);
        result.put("message", operation + "失败: " + e.getMessage());
        result.put("error_type", e.getClass().getSimpleName());
        return result;
    }
    
    /**
     * 获取租户访问令牌
     */
    public String getTenantAccessToken() {
        try {
            // 检查缓存的token是否有效
            if (cachedTenantAccessToken != null && System.currentTimeMillis() < tokenExpireTime) {
                log.info("使用缓存的tenant access token");
                return cachedTenantAccessToken;
            }
            
            log.info("获取新的tenant access token");
            
            // 准备请求参数
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("app_id", feishuConfig.getAppId());
            requestBody.put("app_secret", feishuConfig.getAppSecret());
            
            // 设置请求头
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            // 创建请求实体
            HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);
            
            // 发送请求
            String url = feishuConfig.getBaseUrl() + "/open-apis/auth/v3/tenant_access_token/internal";
            log.info("请求URL: {}", url);
            log.info("请求参数: app_id={}", feishuConfig.getAppId());
            
            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                JsonObject jsonResponse = gson.fromJson(response.getBody(), JsonObject.class);
                
                if (jsonResponse.get("code").getAsInt() == 0) {
                    String token = jsonResponse.get("tenant_access_token").getAsString();
                    int expire = jsonResponse.get("expire").getAsInt();
                    
                    // 缓存token，提前10分钟过期
                    cachedTenantAccessToken = token;
                    tokenExpireTime = System.currentTimeMillis() + (expire - 600) * 1000L;
                    
                    log.info("成功获取tenant access token，有效期: {} 秒", expire);
                    return token;
                } else {
                    String errorMsg = jsonResponse.get("msg").getAsString();
                    log.error("获取token失败: {}", errorMsg);
                    throw new RuntimeException("获取飞书token失败: " + errorMsg);
                }
            } else {
                log.error("HTTP请求失败: {}", response.getStatusCode());
                throw new RuntimeException("HTTP请求失败: " + response.getStatusCode());
            }
            
        } catch (Exception e) {
            log.error("获取飞书token异常", e);
            throw new RuntimeException("获取飞书token异常: " + e.getMessage(), e);
        }
    }
    
    
    
    /**
     * 测试飞书连接
     */
    public Map<String, Object> testConnection() {
        try {
            String token = getTenantAccessToken();
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "飞书连接测试成功");
            result.put("token_preview", token.substring(0, Math.min(token.length(), 20)) + "...");
            result.put("timestamp", System.currentTimeMillis());
            result.put("config", Map.of(
                "app_id", feishuConfig.getAppId(),
                "base_url", feishuConfig.getBaseUrl(),
                "app_secret_length", feishuConfig.getAppSecret().length()
            ));
            
            return result;
            
        } catch (Exception e) {
            log.error("飞书连接测试失败", e);
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "飞书连接测试失败: " + e.getMessage());
            result.put("timestamp", System.currentTimeMillis());
            return result;
        }
    }
    
    /**
     * 获取考勤结果（返回完整日期范围数据）
     */
    public Map<String, Object> getAttendanceResults(String userId, String startDate, String endDate) {
        try {
            // 计算日期范围天数
            java.time.LocalDate start = java.time.LocalDate.parse(startDate);
            java.time.LocalDate end = java.time.LocalDate.parse(endDate);
            long expectedDays = java.time.temporal.ChronoUnit.DAYS.between(start, end) + 1; // 包含结束日期
            
            // 验证日期范围不超过30天（飞书API限制）
            if (expectedDays > 30) {
                log.warn("日期范围超过飞书API限制: {} 天 > 30天", expectedDays);
                Map<String, Object> errorResult = new HashMap<>();
                errorResult.put("success", false);
                errorResult.put("code", 400);
                errorResult.put("msg", String.format("日期范围不能超过30天，当前为%d天", expectedDays));
                errorResult.put("data", null);
                errorResult.put("expectedDays", expectedDays);
                errorResult.put("maxDays", 30);
                return errorResult;
            }
            
            // 日期格式转换（YYYY-MM-DD → YYYYMMDD）
            int checkDateFrom = Integer.parseInt(startDate.replace("-", ""));
            int checkDateTo = Integer.parseInt(endDate.replace("-", ""));
            
            log.info("获取用户: {} 从 {} 到 {} 的考勤记录，预期天数: {}", userId, startDate, endDate, expectedDays);
            
            String token = getTenantAccessToken();
            HttpHeaders headers = createHeaders(token);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("user_ids", new String[]{userId});
            requestBody.put("check_date_from", checkDateFrom);
            requestBody.put("check_date_to", checkDateTo);
            requestBody.put("need_overtime_result", true);
            
            // 尝试多种用户ID类型
            String url;
            ResponseEntity<String> response = null;
            Map<String, Object> result = null;
            String[] employeeTypes = {"user_id", "employee_id", "employee_no"};
            
            for (String employeeType : employeeTypes) {
                try {
                    url = feishuConfig.getBaseUrl() + "/open-apis/attendance/v1/user_tasks/query?employee_type=" + employeeType;
                    log.info("尝试使用 employee_type: {}, URL: {}, 参数: {}", employeeType, url, requestBody);
                    
                    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
                    response = restTemplate.postForEntity(url, requestEntity, String.class);
                    
                    log.info("飞书API响应状态: {}, employee_type: {}", response.getStatusCode(), employeeType);
                    log.info("飞书API响应内容: {}", response.getBody());
                    
                    result = handleApiResponse(response, "获取考勤结果");
                    
                    // 如果成功或者返回了有效数据，跳出循环
                    if (result.get("success").equals(true)) {
                        log.info("成功获取考勤数据，使用 employee_type: {}", employeeType);
                        break;
                    } else {
                        log.warn("employee_type: {} 获取失败: {}", employeeType, result.get("message"));
                    }
                } catch (Exception e) {
                    log.warn("employee_type: {} 请求异常: {}", employeeType, e.getMessage());
                    // 继续尝试下一个类型
                }
            }
            
            // 如果所有尝试都失败了
            if (result == null || !result.get("success").equals(true)) {
                Map<String, Object> errorResult = new HashMap<>();
                errorResult.put("success", false);
                errorResult.put("code", 404);
                errorResult.put("msg", "无法获取用户考勤数据，已尝试所有用户ID类型：" + String.join(", ", employeeTypes));
                errorResult.put("data", null);
                errorResult.put("userId", userId);
                errorResult.put("attemptedTypes", employeeTypes);
                return errorResult;
            }
            
            // 处理成功的响应数据
            if (result.get("success").equals(true) && result.get("data") != null) {
                JsonNode root = (JsonNode) result.get("data");
                JsonNode taskResults = root.get("user_task_results");
                
                // 验证数据一致性
                int actualRecords = 0;
                if (taskResults != null && taskResults.isArray()) {
                    actualRecords = taskResults.size();
                }
                
                // 构建返回结果，保持飞书API的原始数据结构
                Map<String, Object> finalResult = new HashMap<>();
                finalResult.put("success", true);
                finalResult.put("code", 0);
                finalResult.put("dateRange", startDate + " 至 " + endDate);
                finalResult.put("expectedDays", expectedDays);
                finalResult.put("actualRecords", actualRecords);
                finalResult.put("userId", userId);
                
                // 数据一致性状态
                if (actualRecords == 0) {
                    finalResult.put("dataConsistency", "EMPTY");
                    finalResult.put("consistencyMessage", "未找到考勤记录");
                } else if (actualRecords == expectedDays) {
                    finalResult.put("dataConsistency", "CONSISTENT");
                    finalResult.put("consistencyMessage", String.format("数据一致：预期 %d 天，实际 %d 条记录", expectedDays, actualRecords));
                } else {
                    finalResult.put("dataConsistency", "INCONSISTENT");
                    finalResult.put("consistencyMessage", String.format("数据不一致：预期 %d 天，实际 %d 条记录", expectedDays, actualRecords));
                }
                
                // 直接返回飞书API的原始数据结构
                finalResult.put("data", result.get("data"));
                
                return finalResult;
            } else {
                // API调用失败，返回错误信息
                return result;
            }    
        } catch (java.time.format.DateTimeParseException e) {
            log.error("日期解析失败: {}", e.getMessage());
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("success", false);
            errorResult.put("code", 400);
            errorResult.put("msg", "日期格式错误，应为YYYY-MM-DD格式");
            errorResult.put("data", null);
            errorResult.put("error", e.getMessage() != null ? e.getMessage() : "日期解析异常");
            return errorResult;
        } catch (NumberFormatException e) {
            log.error("日期格式转换失败: {}", e.getMessage());
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("success", false);
            errorResult.put("code", 400);
            errorResult.put("msg", "日期格式错误，应为YYYY-MM-DD");
            errorResult.put("data", null);
            errorResult.put("error", e.getMessage() != null ? e.getMessage() : "数字格式异常");
            return errorResult;
        } catch (Exception e) {
            log.error("获取考勤结果异常: {}", e.getMessage(), e);
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("success", false);
            errorResult.put("code", 500);
            errorResult.put("msg", "系统错误: " + (e.getMessage() != null ? e.getMessage() : "未知异常"));
            errorResult.put("data", null);
            errorResult.put("error", e.getClass().getSimpleName());
            if (e.getStackTrace() != null && e.getStackTrace().length > 0) {
                errorResult.put("stackTrace", e.getStackTrace()[0].toString());
            } else {
                errorResult.put("stackTrace", "无堆栈信息");
            }
            return errorResult;
        }
    }
} 