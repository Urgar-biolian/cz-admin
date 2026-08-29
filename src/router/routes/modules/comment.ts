import type { AppRouteModule } from "@/router/types";

import { LAYOUT } from "@/router/constant";

const comment: AppRouteModule = {
  path: "/comment",
  name: "Comment",
  component: LAYOUT,
  redirect: "/comment/index",
  meta: {
    hideChildrenInMenu: true,
    icon: "ant-design:message-outlined",
    title: "评论治理",
    orderNo: 15,
  },
  children: [
    {
      path: "index",
      name: "CommentIndex",
      component: () => import("@/views/comment/index.vue"),
      meta: {
        title: "评论治理",
        icon: "ant-design:message-outlined",
        hideMenu: true,
      },
    },
  ],
};

export default comment;
