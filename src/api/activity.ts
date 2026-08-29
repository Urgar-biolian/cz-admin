import { defHttp } from "@/utils/http/axios";

export interface Activity {
  id: number;
  intro: string;
  detail: string;
  sdate: string;
  edate: string;
  joiners: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityRequest {
  intro: string;
  detail: string;
  sdate: string;
  edate: string;
  joiners: string;
  status: number;
}

export interface UpdateActivityRequest {
  intro?: string;
  detail?: string;
  sdate?: string;
  edate?: string;
  joiners?: string;
  status?: number;
}

export interface ApiResponse<T> {
  code: number;
  messages: string;
  result: T;
}

enum Api {
  Activity = "/activity",
}

/**
 * 获取所有活动
 */
export function getActivitiesApi() {
  return defHttp.get<Activity[]>({
    url: Api.Activity,
  });
}

/**
 * 获取单个活动
 */
export function getActivityApi(id: string) {
  return defHttp.get<Activity>({
    url: `${Api.Activity}/${id}`,
  });
}

/**
 * 创建活动
 */
export function createActivityApi(params: CreateActivityRequest) {
  return defHttp.post<Activity>({
    url: Api.Activity,
    data: params,
  });
}

/**
 * 更新活动
 */
export function updateActivityApi(id: string, params: UpdateActivityRequest) {
  return defHttp.request<Activity>({
    url: `${Api.Activity}/${id}`,
    method: "PATCH",
    data: params,
  });
}

/**
 * 删除活动
 */
export function deleteActivityApi(id: string) {
  return defHttp.delete<Activity>({
    url: `${Api.Activity}/${id}`,
  });
}
