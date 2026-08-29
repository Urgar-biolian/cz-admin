import type { AppRouteModule } from "@/router/types";

import { LAYOUT } from "@/router/constant";

const content: AppRouteModule = {
  path: "/content",
  name: "Content",
  component: LAYOUT,
  redirect: "/content/home",
  meta: {
    orderNo: 16,
    icon: "ant-design:layout-outlined",
    title: "内容管理",
  },
  children: [
    {
      path: "home",
      name: "ContentHome",
      component: () => import("@/views/content/home.vue"),
      meta: {
        title: "官网首页配置",
        icon: "ant-design:home-outlined",
      },
    },
  ],
};

export default content;
