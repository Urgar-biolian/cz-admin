package com.cz.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 创建活动的数据传输对象
 */
@Data
public class CreateActivityDto {
    
    @NotBlank(message = "活动简介不能为空")
    private String intro;
    
    @NotBlank(message = "活动详细描述不能为空")
    private String detail;
    
    @NotBlank(message = "开始日期不能为空")
    private String sdate;
    
    @NotBlank(message = "结束日期不能为空")
    private String edate;
    
    @NotBlank(message = "参与人员不能为空")
    private String joiners;
    
    @NotNull(message = "活动状态不能为空")
    private Integer status;
}