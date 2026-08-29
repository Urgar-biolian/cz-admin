import type { UserInfo } from "#/store";
import type { ErrorMessageMode } from "#/axios";
import { defineStore } from "pinia";
import { store } from "@/store";
import { RoleEnum } from "@/enums/roleEnum";
import { PageEnum } from "@/enums/pageEnum";
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from "@/enums/cacheEnum";
import { getAuthCache, setAuthCache } from "@/utils/auth";
import {
  GetUserInfoModel,
  LoginParams,
  LoginResultModel,
  RoleInfo,
} from "@/api/sys/model/userModel";
import { doLogout, getUserInfo, loginApi } from "@/api/sys/user";
import { useI18n } from "@/hooks/web/useI18n";
import { useMessage } from "@/hooks/web/useMessage";
import { router } from "@/router";
import { usePermissionStore } from "@/store/modules/permission";
import { RouteRecordRaw } from "vue-router";
import { PAGE_NOT_FOUND_ROUTE } from "@/router/routes/basic";
import { h } from "vue";

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

function normalizeRoleList( //Ugar-biolian
  payload?: Partial<GetUserInfoModel & LoginResultModel> | null, //Ugar-biolian
): RoleEnum[] { //Ugar-biolian
  if (!payload) return []; //Ugar-biolian
  if (Array.isArray(payload.roles) && payload.roles.length > 0) { //Ugar-biolian
    return payload.roles.map((item: RoleInfo) => item.value as RoleEnum); //Ugar-biolian
  } //Ugar-biolian
  if (payload.role) { //Ugar-biolian
    return [payload.role as RoleEnum]; //Ugar-biolian
  } //Ugar-biolian
  return []; //Ugar-biolian
} //Ugar-biolian

function hasAdminRole(roleList: RoleEnum[] = []) {
  return roleList.includes(RoleEnum.ADMIN);
}

export const useUserStore = defineStore({
  id: "app-user",
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(state): UserInfo {
      return state.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(state): RoleEnum[] {
      return state.roleList.length > 0
        ? state.roleList
        : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(state): boolean {
      return !!state.sessionTimeout;
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ""; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    clearAuthState() {
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      this.setRoleList([]);
    },
    resetState() {
      this.userInfo = null;
      this.token = "";
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);
        const { token } = data;

        // save token
        this.setToken(token);
        this.setRoleList(normalizeRoleList(data)); //Ugar-biolian
        this.setUserInfo(data as unknown as UserInfo);

        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction();
      if (!hasAdminRole(this.getRoleList)) {
        await this.logout(true);
        throw new Error("当前账号没有管理员权限，无法进入管理后台");
      }

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();

        // 动态路由加载（首次）
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          [...routes, PAGE_NOT_FOUND_ROUTE].forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          // 记录动态路由加载完成
          permissionStore.setDynamicAddedRoute(true);
        }

        goHome && (await router.replace(PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      const userId = this.getUserInfo.userId;
      const userInfo = await getUserInfo(userId);
      this.setUserInfo(userInfo as unknown as UserInfo); //Ugar-biolian
      const roleList = normalizeRoleList(userInfo); //Ugar-biolian
      this.setRoleList(roleList); //Ugar-biolian
      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout(); //Ugar-biolian
        } catch {
          // ignore logout failure and continue clearing local auth state //Ugar-biolian
        }
      }
      this.clearAuthState();
      if (goLogin) {
        // 直接回登陆页
        router.replace(PageEnum.BASE_LOGIN);
      } else {
        // 回登陆页带上当前路由地址
        router.replace({
          path: PageEnum.BASE_LOGIN,
          query: {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          },
        });
      }
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: "warning",
        title: () => h("span", t("sys.app.logoutTip")),
        content: () => h("span", t("sys.app.logoutMessage")),
        onOk: async () => {
          // 主动登出，不带redirect地址
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
