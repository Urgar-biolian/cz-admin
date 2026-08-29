<template>
  <div class="calendar-page">
    <PageWrapper
      title="创智活动日历"
      content="管理创智实验室日常活动和任务安排"
    >
      <Calendar
        :events="events"
        :show-sidebar="true"
        :show-actions="true"
        :show-checkbox="true"
        @add="handleAddEvent"
        @edit="handleEditEvent"
        @delete="handleDeleteEvent"
        @delete-multiple="handleDeleteMultiple"
        @toggle-complete="handleToggleComplete"
      />
    </PageWrapper>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import { PageWrapper } from "@/components/Page";
import { Calendar } from "@/components/Calendar";
import type { CalendarEvent } from "@/components/Calendar/src/types";
import {
  Activity,
  getActivitiesApi,
  createActivityApi,
  updateActivityApi,
  deleteActivityApi,
} from "@/api/activity";

// 活动数据
const events = ref<CalendarEvent[]>([]);
const loading = ref(false);

// 将后端数据转换为前端格式
const convertActivityToEvent = (activity: Activity): CalendarEvent => {
  return {
    id: activity.id.toString(),
    title: activity.intro,
    description: activity.detail,
    joiners: activity.joiners,
    date: activity.sdate,
    sdate: activity.sdate,
    edate: activity.edate,
    startTime: activity.sdate ? activity.sdate.substring(11, 16) : "09:00",
    endTime: activity.edate ? activity.edate.substring(11, 16) : "10:00",
    color: getStatusColor(activity.status),
    completed: activity.status === 2,
    status: activity.status,
  };
};

// 根据状态获取颜色
const getStatusColor = (status: number): string => {
  switch (status) {
    case 0:
      return "#faad14"; // 未开始 - 橙色
    case 1:
      return "#52c41a"; // 进行中 - 绿色
    case 2:
      return "#f5222d"; // 已结束 - 红色
    default:
      return "#faad14";
  }
};

// 获取活动数据
const fetchActivities = async () => {
  try {
    loading.value = true;
    const response = await getActivitiesApi();

    // 处理不同的响应格式
    let activities = [];
    if (response && Array.isArray(response)) {
      // 直接返回数组的情况
      activities = response;
    } else if (response && response.result && Array.isArray(response.result)) {
      // 包含result字段的情况
      activities = response.result;
    } else {
      activities = [];
    }

    events.value = activities.map(convertActivityToEvent);

    // 强制触发响应式更新
    events.value = [...events.value];
  } catch (error) {
    message.error("获取活动数据失败");
    events.value = [];
  } finally {
    loading.value = false;
  }
};

// 事件处理函数
const handleAddEvent = async (eventData: Omit<CalendarEvent, "id">) => {
  try {
    const activityData = {
      intro: eventData.title,
      detail: eventData.description || "",
      sdate: eventData.sdate || "",
      edate: eventData.edate || "",
      joiners: eventData.joiners || "待定",
      status: 0,
    };
    await createActivityApi(activityData);
    message.success("活动添加成功");
    await fetchActivities();
  } catch (error) {
    message.error("添加活动失败");
  }
};

const handleEditEvent = async (event: CalendarEvent) => {
  try {
    const activityData = {
      intro: event.title,
      detail: event.description || "",
      sdate: event.sdate || "",
      edate: event.edate || "",
      joiners: event.joiners || "待定",
      status: event.status || 0,
    };
    await updateActivityApi(parseInt(event.id), activityData);
    message.success("活动更新成功");
    await fetchActivities();
  } catch (error) {
    message.error("更新活动失败");
  }
};

const handleDeleteEvent = async (eventId: string) => {
  try {
    await deleteActivityApi(parseInt(eventId));
    message.success("活动删除成功");
    await fetchActivities(); // 重新获取数据
  } catch (error) {
    message.error("删除活动失败");
  }
};

const handleDeleteMultiple = async (eventIds: string[]) => {
  try {
    // 批量删除
    await Promise.all(eventIds.map((id) => deleteActivityApi(parseInt(id))));
    message.success(`成功删除 ${eventIds.length} 个活动`);
    await fetchActivities(); // 重新获取数据
  } catch (error) {
    message.error("批量删除活动失败");
  }
};

const handleToggleComplete = async (eventId: string, completed: boolean) => {
  try {
    const status = completed ? 2 : 0; // 完成状态对应已结束，未完成对应未开始
    await updateActivityApi(parseInt(eventId), { status });
    message.success(completed ? "活动标记为已完成" : "活动标记为未完成");
    await fetchActivities(); // 重新获取数据
  } catch (error) {
    message.error("更新活动状态失败");
  }
};

// 初始化时获取数据
onMounted(() => {
  fetchActivities();
});
</script>

<style lang="less" scoped>
.calendar-page {
  height: 100vh;
  padding: 20px;
  background: #f5f5f5;
}
</style>
