package com.cz.admin.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 活动实体类
 * 对应 official 项目中的 activity 表结构
 */
@Entity
@Table(name = "activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Activity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * 活动简介，显示在日历上
     */
    @Column(nullable = false)
    private String intro;
    
    /**
     * 活动详细描述
     */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String detail;
    
    /**
     * 开始日期 (YYYY-MM-DD)
     */
    @Column(nullable = false)
    private String sdate;
    
    /**
     * 结束日期 (YYYY-MM-DD)
     */
    @Column(nullable = false)
    private String edate;
    
    /**
     * 参与人员，逗号分隔
     */
    @Column(nullable = false)
    private String joiners;
    
    /**
     * 活动状态 (0=未开始, 1=进行中, 2=已结束)
     */
    @Column(nullable = false)
    private Integer status;
    
    /**
     * 创建时间
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}