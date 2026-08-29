import { defHttp } from "@/utils/http/axios";
import { BasicPageParams, BasicFetchResult } from "@/api/model/baseModel";

const Api = {
  ATTENDANCE: "/admin/attendance",
  ATTENDANCE_STATS: "/admin/attendance/stats",
  ATTENDANCE_USER: "/admin/attendance/user",
  ATTENDANCE_SYNC: "/admin/attendance/sync",
  ATTENDANCE_EXPORT: "/admin/attendance/export",
};

export enum AttendanceType {
  CLOCK_IN = "CLOCK_IN",
  CLOCK_OUT = "CLOCK_OUT",
  BREAK_START = "BREAK_START",
  BREAK_END = "BREAK_END",
}

export enum AttendanceStatus {
  NORMAL = "NORMAL",
  LATE = "LATE",
  EARLY_LEAVE = "EARLY_LEAVE",
  ABSENT = "ABSENT",
  OVERTIME = "OVERTIME",
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  user?: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  type: AttendanceType;
  clockTime: string;
  location?: string;
  deviceInfo?: string;
  status: AttendanceStatus;
  remark?: string;
  feishuRecordId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttendanceDto {
  userId: string;
  type: AttendanceType;
  clockTime: string;
  location?: string;
  deviceInfo?: string;
  status?: AttendanceStatus;
  remark?: string;
  feishuRecordId?: string;
}

export interface UpdateAttendanceDto {
  type?: AttendanceType;
  clockTime?: string;
  location?: string;
  deviceInfo?: string;
  status?: AttendanceStatus;
  remark?: string;
}

export interface AttendanceQueryDto extends BasicPageParams {
  userId?: string;
  type?: AttendanceType;
  status?: AttendanceStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface AttendanceStats {
  totalRecords: number;
  normalCount: number;
  lateCount: number;
  earlyLeaveCount: number;
  absentCount: number;
  overtimeCount: number;
  attendanceRate: number;
}

/**
 * 获取考勤记录列表
 */
export function getAttendanceRecords(params: AttendanceQueryDto) {
  return defHttp.get<BasicFetchResult<AttendanceRecord>>({
    url: Api.ATTENDANCE,
    params,
  });
}

/**
 * 获取考勤统计
 */
export function getAttendanceStats(params: {
  userId?: string;
  startDate?: string;
  endDate?: string;
}) {
  return defHttp.get<AttendanceStats>({
    url: Api.ATTENDANCE_STATS,
    params,
  });
}

/**
 * 获取用户考勤记录
 */
export function getUserAttendance(
  userId: string,
  params: {
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  },
) {
  return defHttp.get<BasicFetchResult<AttendanceRecord>>({
    url: `${Api.ATTENDANCE_USER}/${userId}`,
    params,
  });
}

/**
 * 创建考勤记录
 */
export function createAttendanceRecord(data: CreateAttendanceDto) {
  return defHttp.post<AttendanceRecord>({
    url: Api.ATTENDANCE,
    data,
  });
}

/**
 * 更新考勤记录
 */
export function updateAttendanceRecord(id: string, data: UpdateAttendanceDto) {
  return defHttp.patch<AttendanceRecord>({
    url: `${Api.ATTENDANCE}/${id}`,
    data,
  });
}

/**
 * 删除考勤记录
 */
export function deleteAttendanceRecord(id: string) {
  return defHttp.delete<void>({
    url: `${Api.ATTENDANCE}/${id}`,
  });
}

/**
 * 同步飞书考勤数据
 */
export function syncFeishuAttendance(params: {
  userIds?: string[];
  startDate: string;
  endDate: string;
}) {
  return defHttp.post<{ syncCount: number }>({
    url: Api.ATTENDANCE_SYNC,
    data: params,
  });
}

/**
 * 导出考勤数据
 */
export function exportAttendanceData(params: {
  userId?: string;
  startDate?: string;
  endDate?: string;
  format?: "excel" | "csv";
}) {
  return defHttp.get<Blob>({
    url: Api.ATTENDANCE_EXPORT,
    params,
    responseType: "blob",
  });
}
