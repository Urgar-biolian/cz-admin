# 活动日历组件

## 概述

活动日历组件是一个功能完整的日历管理系统，支持活动的创建、编辑、删除和状态管理。组件集成了后端API，提供完整的CRUD操作。

## 功能特性

- 📅 日历视图：支持月视图显示，可切换月份
- 📝 活动管理：创建、编辑、删除活动
- 👥 参与人员：支持多人参与的活动
- 🏷️ 状态管理：未开始、进行中、已结束三种状态
- 🎨 颜色标记：不同状态用不同颜色区分
- ✅ 批量操作：支持批量删除活动
- 📱 响应式设计：适配不同屏幕尺寸

## 数据结构

### CalendarEvent 接口

```typescript
interface CalendarEvent {
  id: string;           // 活动ID
  title: string;        // 活动标题
  description?: string; // 活动描述
  joiners?: string;     // 参与人员
  date: string;         // 活动日期 (YYYY-MM-DD)
  startTime: string;    // 开始时间 (HH:mm)
  endTime: string;      // 结束时间 (HH:mm)
  color?: string;       // 活动颜色
  completed?: boolean;  // 是否完成
  status?: number;      // 活动状态 (0=未开始, 1=进行中, 2=已结束)
}
```

### Activity 接口 (后端)

```typescript
interface Activity {
  id: number;           // 活动ID
  intro: string;        // 活动简介
  detail: string;       // 活动详细描述
  sdate: string;        // 开始日期
  edate: string;        // 结束日期
  joiners: string;      // 参与人员
  status: number;       // 活动状态
  createdAt: string;    // 创建时间
  updatedAt: string;    // 更新时间
}
```

## 使用方法

### 1. 基本使用

```vue
<template>
  <Calendar 
    :events="events"
    @add="handleAddEvent"
    @edit="handleEditEvent"
    @delete="handleDeleteEvent"
    @delete-multiple="handleDeleteMultiple"
  />
</template>

<script setup>
import { Calendar } from '@/components/Calendar';
import { getActivitiesApi, createActivityApi, updateActivityApi, deleteActivityApi } from '@/api/activity';

// 获取活动数据
const fetchActivities = async () => {
  const response = await getActivitiesApi();
  events.value = response.result.map(convertActivityToEvent);
};

// 添加活动
const handleAddEvent = async (eventData) => {
  const activityData = {
    intro: eventData.title,
    detail: eventData.description || '',
    sdate: eventData.date,
    edate: eventData.date,
    joiners: eventData.joiners || '待定',
    status: 0,
  };
  await createActivityApi(activityData);
  await fetchActivities();
};
</script>
```

### 2. 完整示例

```vue
<template>
  <PageWrapper title="活动日历">
    <Calendar 
      :events="events"
      :loading="loading"
      @add="handleAddEvent"
      @edit="handleEditEvent"
      @delete="handleDeleteEvent"
      @delete-multiple="handleDeleteMultiple"
      @toggle-complete="handleToggleComplete"
    />
  </PageWrapper>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { PageWrapper } from '@/components/Page';
import { Calendar } from '@/components/Calendar';
import { 
  getActivitiesApi, 
  createActivityApi, 
  updateActivityApi, 
  deleteActivityApi 
} from '@/api/activity';

const events = ref([]);
const loading = ref(false);

// 数据转换函数
const convertActivityToEvent = (activity) => {
  return {
    id: activity.id.toString(),
    title: activity.intro,
    description: activity.detail,
    joiners: activity.joiners,
    date: activity.sdate,
    startTime: '09:00',
    endTime: '10:00',
    color: getStatusColor(activity.status),
    completed: activity.status === 2,
    status: activity.status,
  };
};

// 获取活动数据
const fetchActivities = async () => {
  try {
    loading.value = true;
    const response = await getActivitiesApi();
    if (response.result) {
      events.value = response.result.map(convertActivityToEvent);
    }
  } catch (error) {
    message.error('获取活动数据失败');
  } finally {
    loading.value = false;
  }
};

// 事件处理函数
const handleAddEvent = async (eventData) => {
  try {
    const activityData = {
      intro: eventData.title,
      detail: eventData.description || '',
      sdate: eventData.date,
      edate: eventData.date,
      joiners: eventData.joiners || '待定',
      status: 0,
    };
    await createActivityApi(activityData);
    message.success('活动添加成功');
    await fetchActivities();
  } catch (error) {
    message.error('添加活动失败');
  }
};

const handleEditEvent = async (event) => {
  try {
    const activityData = {
      intro: event.title,
      detail: event.description || '',
      sdate: event.date,
      edate: event.date,
      joiners: event.joiners || '待定',
      status: event.completed ? 2 : 0,
    };
    await updateActivityApi(parseInt(event.id), activityData);
    message.success('活动更新成功');
    await fetchActivities();
  } catch (error) {
    message.error('更新活动失败');
  }
};

const handleDeleteEvent = async (eventId) => {
  try {
    await deleteActivityApi(parseInt(eventId));
    message.success('活动删除成功');
    await fetchActivities();
  } catch (error) {
    message.error('删除活动失败');
  }
};

const handleDeleteMultiple = async (eventIds) => {
  try {
    await Promise.all(eventIds.map(id => deleteActivityApi(parseInt(id))));
    message.success(`成功删除 ${eventIds.length} 个活动`);
    await fetchActivities();
  } catch (error) {
    message.error('批量删除活动失败');
  }
};

const handleToggleComplete = async (eventId, completed) => {
  try {
    const status = completed ? 2 : 0;
    await updateActivityApi(parseInt(eventId), { status });
    message.success(completed ? '活动标记为已完成' : '活动标记为未完成');
    await fetchActivities();
  } catch (error) {
    message.error('更新活动状态失败');
  }
};

onMounted(() => {
  fetchActivities();
});
</script>
```

## API 接口

### 获取所有活动
```typescript
GET /api/activity
```

### 创建活动
```typescript
POST /api/activity
{
  "intro": "活动标题",
  "detail": "活动描述",
  "sdate": "2024-12-15",
  "edate": "2024-12-15",
  "joiners": "张三,李四",
  "status": 0
}
```

### 更新活动
```typescript
PATCH /api/activity/{id}
{
  "intro": "更新后的标题",
  "status": 1
}
```

### 删除活动
```typescript
DELETE /api/activity/{id}
```

## 状态说明

| 状态值 | 状态名称 | 颜色 | 描述 |
|--------|----------|------|------|
| 0 | 未开始 | 蓝色 | 活动尚未开始 |
| 1 | 进行中 | 绿色 | 活动正在进行 |
| 2 | 已结束 | 橙色 | 活动已经结束 |

## 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| events | CalendarEvent[] | [] | 活动数据数组 |
| showSidebar | boolean | true | 是否显示侧边栏 |
| showActions | boolean | true | 是否显示操作按钮 |
| showCheckbox | boolean | true | 是否显示复选框 |

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| add | eventData | 添加活动时触发 |
| edit | event | 编辑活动时触发 |
| delete | eventId | 删除活动时触发 |
| delete-multiple | eventIds | 批量删除时触发 |
| toggle-complete | (eventId, completed) | 切换完成状态时触发 |

## 样式定制

组件使用 Less 预处理器，可以通过以下方式定制样式：

```less
.calendar-container {
  // 自定义容器样式
}

.event-item {
  // 自定义事件项样式
}

.event-title {
  // 自定义标题样式
}
```

## 注意事项

1. **日期格式**：所有日期字段使用 `YYYY-MM-DD` 格式
2. **时间格式**：时间字段使用 `HH:mm` 格式
3. **参与人员**：多个人员用逗号分隔
4. **状态值**：只能是 0、1、2 三个值
5. **API 错误处理**：所有 API 调用都包含错误处理

## 更新日志

### v1.0.0
- 初始版本发布
- 支持基本的 CRUD 操作
- 集成后端 API
- 添加状态管理功能
- 支持参与人员字段 