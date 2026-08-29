import { MockMethod } from "vite-plugin-mock";
import { resultSuccess, resultError } from "../_util";
import { ResultEnum } from "../../src/enums/httpEnum";
import dayjs from "dayjs";

// 模拟活动数据
const activities = [
  {
    id: 1,
    title: "春季户外活动",
    description: "享受春天的美好时光",
    sdate: "2024-03-15",
    edate: "2024-03-20",
    location: "城市公园",
    maxParticipants: 50,
    currentParticipants: 25,
    status: "active",
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-03-01T10:00:00Z",
  },
  {
    id: 2,
    title: "技术分享会",
    description: "分享最新的技术趋势",
    sdate: "2024-04-10",
    edate: "2024-04-10",
    location: "会议室A",
    maxParticipants: 30,
    currentParticipants: 18,
    status: "active",
    createdAt: "2024-03-05T14:30:00Z",
    updatedAt: "2024-03-05T14:30:00Z",
  },
  {
    id: 3,
    title: "团队建设活动",
    description: "增强团队凝聚力",
    sdate: "2024-05-01",
    edate: "2024-05-03",
    location: "度假村",
    maxParticipants: 100,
    currentParticipants: 85,
    status: "active",
    createdAt: "2024-03-10T09:15:00Z",
    updatedAt: "2024-03-10T09:15:00Z",
  },
];

// 统一格式化为YYYY-MM-DD格式
activities.forEach((activity) => {
  if (activity.sdate) {
    activity.sdate = dayjs(activity.sdate).format("YYYY-MM-DD");
  }
  if (activity.edate) {
    activity.edate = dayjs(activity.edate).format("YYYY-MM-DD");
  }
});

export default [
  // 获取所有活动
  {
    url: "/basic-api/activity",
    timeout: 1000,
    method: "get",
    response: () => {
      return resultSuccess(activities);
    },
  },

  // 获取单个活动
  {
    url: "/basic-api/activity/:id",
    timeout: 1000,
    method: "get",
    response: ({ query }) => {
      const id = parseInt(query.id);
      const activity = activities.find((item) => item.id === id);
      if (activity) {
        return resultSuccess(activity);
      } else {
        return resultError("活动不存在", { code: ResultEnum.ERROR });
      }
    },
  },

  // 创建活动
  {
    url: "/basic-api/activity",
    timeout: 1000,
    method: "post",
    response: ({ body }) => {
      const newActivity = {
        id: activities.length + 1,
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 格式化日期
      if (newActivity.sdate) {
        newActivity.sdate = dayjs(newActivity.sdate).format("YYYY-MM-DD");
      }
      if (newActivity.edate) {
        newActivity.edate = dayjs(newActivity.edate).format("YYYY-MM-DD");
      }

      activities.push(newActivity);
      return resultSuccess(newActivity);
    },
  },

  // 更新活动
  {
    url: "/basic-api/activity/:id",
    timeout: 1000,
    method: "patch",
    response: ({ query, body }) => {
      const id = parseInt(query.id);
      const index = activities.findIndex((item) => item.id === id);
      if (index !== -1) {
        const updatedActivity = {
          ...activities[index],
          ...body,
          updatedAt: new Date().toISOString(),
        };

        // 格式化日期
        if (updatedActivity.sdate) {
          updatedActivity.sdate = dayjs(updatedActivity.sdate).format(
            "YYYY-MM-DD",
          );
        }
        if (updatedActivity.edate) {
          updatedActivity.edate = dayjs(updatedActivity.edate).format(
            "YYYY-MM-DD",
          );
        }

        activities[index] = updatedActivity;
        return resultSuccess(activities[index]);
      } else {
        return resultError("活动不存在", { code: ResultEnum.ERROR });
      }
    },
  },

  // 删除活动
  {
    url: "/basic-api/activity/:id",
    timeout: 1000,
    method: "delete",
    response: ({ query }) => {
      const id = parseInt(query.id);
      const index = activities.findIndex((item) => item.id === id);
      if (index !== -1) {
        const deletedActivity = activities[index];
        activities.splice(index, 1);
        return resultSuccess(deletedActivity);
      } else {
        return resultError("活动不存在", { code: ResultEnum.ERROR });
      }
    },
  },
] as MockMethod[];
