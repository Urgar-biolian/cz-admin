import { defHttp } from "@/utils/http/axios";

const Api = {
  FEISHU_AUTH: "/admin/feishu/auth",
  FEISHU_CALLBACK: "/admin/feishu/callback",
  FEISHU_USER_INFO: "/admin/feishu/user-info",
  FEISHU_DEPARTMENTS: "/admin/feishu/departments",
  FEISHU_USERS: "/admin/feishu/users",
  FEISHU_ATTENDANCE: "/admin/feishu/attendance",
};

/**
 * 获取飞书授权URL
 */
export function getFeishuAuthUrl() {
  return defHttp.get<{ authUrl: string }>({ url: Api.FEISHU_AUTH });
}

/**
 * 飞书授权回调
 */
export function feishuCallback(code: string) {
  return defHttp.post<{ accessToken: string }>({
    url: Api.FEISHU_CALLBACK,
    params: { code },
  });
}

/**
 * 获取飞书用户信息
 */
export function getFeishuUserInfo(userId: string) {
  return defHttp.get<any>({
    url: `${Api.FEISHU_USER_INFO}/${userId}`,
  });
}

/**
 * 获取飞书部门列表
 */
export function getFeishuDepartments() {
  return defHttp.get<any[]>({ url: Api.FEISHU_DEPARTMENTS });
}

/**
 * 获取飞书用户列表
 */
export function getFeishuUsers(departmentId?: string) {
  return defHttp.get<any[]>({
    url: Api.FEISHU_USERS,
    params: departmentId ? { departmentId } : {},
  });
}

/**
 * 获取飞书考勤数据
 */
export function getFeishuAttendance(params: {
  userIds?: string[];
  startTime: string;
  endTime: string;
}) {
  return defHttp.get<any[]>({
    url: Api.FEISHU_ATTENDANCE,
    params,
  });
}
