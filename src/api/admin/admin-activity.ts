import { defHttp } from "@/utils/http/axios";
import { BasicPageParams, BasicFetchResult } from "@/api/model/baseModel";

const Api = {
  ADMIN_ACTIVITY: "/admin/admin-activity",
  ADMIN_ACTIVITY_STATUS: "/admin/admin-activity/status",
  ADMIN_ACTIVITY_PUBLISH: "/admin/admin-activity/publish",
  ADMIN_ACTIVITY_UNPUBLISH: "/admin/admin-activity/unpublish",
  ADMIN_ACTIVITY_STATS: "/admin/admin-activity/stats",
};

export enum ActivityStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface AdminActivity {
  id: string;
  title: string;
  description?: string;
  content?: string;
  startTime: string;
  endTime: string;
  location?: string;
  status: ActivityStatus;
  imageUrl?: string;
  maxParticipants?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  participants?: {
    id: string;
    userId: string;
    user: {
      id: string;
      username: string;
      email: string;
      avatar?: string;
    };
    joinedAt: string;
  }[];
  participantCount: number;
}

export interface CreateActivityDto {
  title: string;
  description?: string;
  content?: string;
  startTime: string;
  endTime: string;
  location?: string;
  imageUrl?: string;
  maxParticipants?: number;
  tags?: string[];
}

export interface UpdateActivityDto {
  title?: string;
  description?: string;
  content?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  status?: ActivityStatus;
  imageUrl?: string;
  maxParticipants?: number;
  tags?: string[];
}

export interface ActivityQueryDto extends BasicPageParams {
  status?: ActivityStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface ActivityStats {
  totalActivities: number;
  draftCount: number;
  publishedCount: number;
  cancelledCount: number;
  completedCount: number;
  totalParticipants: number;
  averageParticipants: number;
}

/**
 * 获取活动列表
 */
export function getAdminActivities(params: ActivityQueryDto) {
  return defHttp.get<BasicFetchResult<AdminActivity>>({
    url: Api.ADMIN_ACTIVITY,
    params,
  });
}

/**
 * 获取活动详情
 */
export function getAdminActivity(id: string) {
  return defHttp.get<AdminActivity>({
    url: `${Api.ADMIN_ACTIVITY}/${id}`,
  });
}

/**
 * 创建活动
 */
export function createAdminActivity(data: CreateActivityDto) {
  return defHttp.post<AdminActivity>({
    url: Api.ADMIN_ACTIVITY,
    data,
  });
}

/**
 * 更新活动
 */
export function updateAdminActivity(id: string, data: UpdateActivityDto) {
  return defHttp.patch<AdminActivity>({
    url: `${Api.ADMIN_ACTIVITY}/${id}`,
    data,
  });
}

/**
 * 删除活动
 */
export function deleteAdminActivity(id: string) {
  return defHttp.delete<void>({
    url: `${Api.ADMIN_ACTIVITY}/${id}`,
  });
}

/**
 * 按状态获取活动
 */
export function getActivitiesByStatus(
  status: ActivityStatus,
  params?: BasicPageParams,
) {
  return defHttp.get<BasicFetchResult<AdminActivity>>({
    url: `${Api.ADMIN_ACTIVITY_STATUS}/${status}`,
    params,
  });
}

/**
 * 发布活动
 */
export function publishActivity(id: string) {
  return defHttp.post<AdminActivity>({
    url: `${Api.ADMIN_ACTIVITY_PUBLISH}/${id}`,
  });
}

/**
 * 取消发布活动
 */
export function unpublishActivity(id: string) {
  return defHttp.post<AdminActivity>({
    url: `${Api.ADMIN_ACTIVITY_UNPUBLISH}/${id}`,
  });
}

/**
 * 获取活动统计
 */
export function getActivityStats() {
  return defHttp.get<ActivityStats>({
    url: Api.ADMIN_ACTIVITY_STATS,
  });
}
