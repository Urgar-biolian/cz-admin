import type { AppRouteModule } from "@/router/types";

import { LAYOUT } from "@/router/constant";

const activity: AppRouteModule = {
  path: "/activity",
  name: "Activity",
  component: LAYOUT,
  redirect: "/activity/index",
  meta: {
    orderNo: 20,
    icon: "ion:calendar-outline",
    title: "活动运营",
  },
  children: [
    {
      path: "index",
      name: "ActivityIndex",
      component: () => import("@/views/activity/index.vue"),
      meta: {
        title: "活动列表",
        icon: "ant-design:unordered-list-outlined",
      },
    },
    {
      path: "calendar",
      name: "ActivityCalendar",
      component: () => import("@/views/calendar/events/index.vue"),
      meta: {
        title: "活动日历",
        icon: "ant-design:calendar-outlined",
      },
    },
  ],
};

export default activity;
