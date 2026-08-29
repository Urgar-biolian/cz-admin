/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  email: string;
  password: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  username?: string;
  email?: string;
  token: string;
  role?: string;
  roles: RoleInfo[];
  avatar?: string;
  github?: string;
  major?: string;
  grade?: number;
  admissionYear?: number;
  memberType?: "STUDENT" | "GRADUATED" | "ADVISOR";
  gradeLabel?: string;
  badge?: string;
  background?: string;
  description?: string;
  createdAt?: string;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  createdAt: string;
  userId: string | number;
  username: string;
  avatar?: string;
  description?: string;
  role: string;
  roles?: RoleInfo[];
  permissions?: string[];
  email: string;
  background?: string;
  token: string;
  github?: string;
  major?: string;
  grade?: number;
  admissionYear?: number;
  memberType?: "STUDENT" | "GRADUATED" | "ADVISOR";
  gradeLabel?: string;
  badge?: string;
  homePath?: string;
}
