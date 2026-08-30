import type { AppRouteModule } from "@/router/types";

import { LAYOUT } from "@/router/constant";

const invitation: AppRouteModule = {
  path: "/invitation",
  name: "invitation",
  component: LAYOUT,
  redirect: "/invitation/index",
  meta: {
    hideChildrenInMenu: true,
    icon: "ant-design:qrcode-outlined",
    title: "邀请码",
    orderNo: 100001,
  },
  children: [
    {
      path: "index",
      name: "invitationPage",
      component: () => import("@/views/sys/invitation/index.vue"),
      meta: {
        title: "邀请码",
        icon: "ant-design:qrcode-outlined",
        hideMenu: true,
      },
    },
  ],
};

export default invitation;
