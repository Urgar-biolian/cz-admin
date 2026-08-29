package com.cz.admin.dto;

import lombok.Data;

/**
 * 更新活动的数据传输对象
 */
@Data
public class UpdateActivityDto {
    
    private String intro;
    
    private String detail;
    
    private String sdate;
    
    private String edate;
    
    private String joiners;
    
    private Integer status;
}