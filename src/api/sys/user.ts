import { defHttp } from "@/utils/http/axios";
import {
  LoginParams,
  LoginResultModel,
  GetUserInfoModel,
} from "./model/userModel";

import { ErrorMessageMode } from "#/axios";
import { useUserStore } from "@/store/modules/user";

enum Api {
  Login = "/login",
  Logout = "/logout",
  GetUserInfo = "/getUserInfo",
  GetAllUser = "/all",
  GetAdminUsers = "/admin/users",
  GetAdminUserOptions = "/admin/user-options",
  GetPermCode = "/getPermCode",
  TestRetry = "/testRetry",
}

/**
 * @description: user login api
 */
export function loginApi(
  params: LoginParams,
  mode: ErrorMessageMode = "modal",
) {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      data: params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo(userId?: string | number) {
  const resolvedUserId = userId ?? useUserStore().getUserInfo.userId;

  return defHttp.get<GetUserInfoModel>(
    { url: Api.GetUserInfo + `/${resolvedUserId}` },
    { errorMessageMode: "none" },
  );
}

export function setUserRole(
  userId: number,
  payload: {
    role: string;
    memberType?: "STUDENT" | "GRADUATED" | "ADVISOR";
    admissionYear?: number | null;
  },
) {
  return defHttp.patch<GetUserInfoModel>(
    {
      url: `${Api.GetAdminUsers}/${userId}`,
      data: payload,
    },
    {
      errorMessageMode: "message",
      retryRequest: {
        isOpenRetry: false,
        count: 0,
        waitTime: 0,
      },
    },
  );
}

export function getAllUser() {
  return defHttp.get<GetUserInfoModel[]>(
    { url: Api.GetAllUser },
    { errorMessageMode: "none" },
  );
}

export function getAdminUserPage(params: {
  page?: number;
  pageSize?: number;
  username?: string;
  role?: string;
  major?: string;
  memberType?: "STUDENT" | "GRADUATED" | "ADVISOR" | "";
  admissionYear?: number;
}) {
  return defHttp.get<{ items: GetUserInfoModel[]; total: number }>(
    {
      url: Api.GetAdminUsers,
      params,
    },
    { errorMessageMode: "none" },
  );
}

export function getAdminUserOptions() {
  return defHttp.get<Array<{ userId: number; username: string }>>(
    { url: Api.GetAdminUserOptions },
    { errorMessageMode: "none" },
  );
}

export function getUserInfoById(userId: number) {
  return defHttp.get<GetUserInfoModel>(
    { url: Api.GetUserInfo + `/${userId}` },
    { errorMessageMode: "none" },
  );
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp
    .post(
      { url: Api.Logout },
      {
        errorMessageMode: "none",
      },
    )
    .catch(() => Promise.resolve());
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}
