import type { AppRouteModule } from "@/router/types";
import { LAYOUT } from "@/router/constant";

const lanqiaoWinner: AppRouteModule = {
  path: "/lanqiao-winner",
  name: "LanqiaoWinner",
  component: LAYOUT,
  redirect: "/lanqiao-winner/index",
  meta: {
    hideChildrenInMenu: true,
    icon: "award", // 可根据实际 icon 库调整
    title: "成员成就管理",
    orderNo: 50000,
  },
  children: [
    {
      path: "index",
      name: "LanqiaoWinnerPage",
      component: () => import("@/views/lanqiao/winner/index.vue"),
      meta: {
        title: "成员成就管理",
        icon: "award",
        hideMenu: true,
      },
    },
  ],
};

export default lanqiaoWinner;
