package com.cz.admin.repository;

import com.cz.admin.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 活动数据访问层
 */
@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    
    /**
     * 按创建时间倒序查询所有活动
     */
    @Query("SELECT a FROM Activity a ORDER BY a.createdAt DESC")
    List<Activity> findAllOrderByCreatedAtDesc();
    
    /**
     * 根据状态查询活动
     */
    List<Activity> findByStatusOrderByCreatedAtDesc(Integer status);
    
    /**
     * 根据日期范围查询活动
     */
    @Query("SELECT a FROM Activity a WHERE a.sdate <= ?2 AND a.edate >= ?1 ORDER BY a.createdAt DESC")
    List<Activity> findByDateRange(String startDate, String endDate);
}