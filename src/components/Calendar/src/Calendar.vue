<template>
  <div class="calendar-container">
    <!-- 侧边栏 -->
    <div class="calendar-sidebar" v-if="showSidebar">
      <div class="sidebar-header">
        <h3>日历</h3>
        <Button type="primary" size="small" @click="showAddModal = true">
          <PlusOutlined />
          添加活动
        </Button>
      </div>

      <!-- 月份导航 -->
      <div class="month-navigation">
        <Button @click="previousMonth" :icon="h(LeftOutlined)" />
        <span class="current-month">{{ currentMonthYear }}</span>
        <Button @click="nextMonth" :icon="h(RightOutlined)" />
      </div>

      <!-- 日历网格 -->
      <div class="calendar-grid">
        <div class="weekdays">
          <div v-for="day in weekDays" :key="day" class="weekday">
            {{ day }}
          </div>
        </div>
        <div class="days">
          <div
            v-for="date in calendarDates"
            :key="date.key"
            :class="[
              'day',
              {
                'other-month': !date.isCurrentMonth,
                today: date.isToday,
                selected: selectedDate === date.date,
                'has-events': getEventsForDate(date.date).length > 0,
              },
            ]"
            @click="selectDate(date.date)"
          >
            <span class="day-number">{{ date.day }}</span>
            <div class="event-indicators">
              <div
                v-for="event in getEventsForDate(date.date).slice(0, 3)"
                :key="event.id"
                class="event-dot"
                :style="{ backgroundColor: event.color || '#1890ff' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="calendar-main">
      <div class="main-header">
        <div class="header-left">
          <h2>{{ selectedDate ? formatDate(selectedDate) : "活动列表" }}</h2>
          <span class="event-count">{{ filteredEvents.length }} 个活动</span>
        </div>
        <div class="header-actions">
          <Button @click="showAddModal = true" type="primary">
            <PlusOutlined />
            添加活动
          </Button>
          <Button
            v-if="selectedEvents.length > 0"
            @click="deleteMultiple"
            danger
          >
            <DeleteOutlined />
            批量删除 ({{ selectedEvents.length }})
          </Button>
        </div>
      </div>

      <!-- 活动列表 -->
      <div class="events-list">
        <div
          v-for="event in sortedEvents"
          :key="event.id"
          :class="['event-item', { completed: event.completed }]"
        >
          <div class="event-checkbox" v-if="showCheckbox">
            <Checkbox
              :checked="selectedEvents.includes(event.id)"
              @change="(e) => toggleEventSelection(event.id, e.target.checked)"
            />
          </div>

          <div class="event-content">
            <div class="event-header">
              <div class="event-time">
                {{ event.startTime }} - {{ event.endTime }}
              </div>
              <div class="event-date">{{ formatEventDate(event.date) }}</div>
            </div>

            <div class="event-title">{{ event.title }}</div>

            <div v-if="event.description" class="event-description">
              {{ event.description }}
            </div>

            <div v-if="event.joiners" class="event-joiners">
              参与人员: {{ event.joiners }}
            </div>

            <div class="event-status">
              <Tag :color="getStatusColor(event.status || 0)">
                {{ getStatusText(event.status || 0) }}
              </Tag>
            </div>
          </div>

          <div class="event-actions" v-if="showActions">
            <Button
              size="small"
              @click="editEvent(event)"
              :icon="h(EditOutlined)"
            >
              编辑
            </Button>
            <Button
              size="small"
              danger
              @click="deleteEvent(event.id)"
              :icon="h(DeleteOutlined)"
            >
              删除
            </Button>
          </div>
        </div>

        <div v-if="sortedEvents.length === 0" class="no-events">
          <Empty description="暂无活动" />
        </div>
      </div>
    </div>

    <!-- 添加/编辑活动模态框 -->
    <Modal
      v-model:open="showAddModal"
      :title="isEditing ? '编辑活动' : '添加活动'"
      @ok="saveEvent"
      @cancel="cancelEdit"
      width="600px"
    >
      <div class="calendar-modal-form-wrapper">
        <Form
          ref="eventFormRef"
          :model="eventForm"
          :rules="eventRules"
          layout="vertical"
        >
          <FormItem label="活动标题" name="title">
            <Input
              v-model:value="eventForm.title"
              placeholder="请输入活动标题"
            />
          </FormItem>

          <FormItem label="活动描述" name="description">
            <Textarea
              v-model:value="eventForm.description"
              placeholder="请输入活动描述"
              :rows="3"
            />
          </FormItem>

          <FormItem label="参与人员" name="joiners">
            <Input
              v-model:value="eventForm.joiners"
              placeholder="请输入参与人员，多个人员用逗号分隔"
            />
          </FormItem>

          <Row :gutter="16">
            <Col :span="12">
              <FormItem label="开始时间" name="sdate">
                <DatePicker
                  v-model:value="eventForm.sdate"
                  style="width: 100%"
                  placeholder="选择开始时间"
                  format="YYYY-MM-DD"
                />
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem label="结束时间" name="edate">
                <DatePicker
                  v-model:value="eventForm.edate"
                  style="width: 100%"
                  placeholder="选择结束时间"
                  format="YYYY-MM-DD"
                />
              </FormItem>
            </Col>
          </Row>

          <FormItem label="活动状态" name="status">
            <Select
              v-model:value="eventForm.status"
              placeholder="请选择活动状态"
            >
              <Select.Option :value="0">未开始</Select.Option>
              <Select.Option :value="1">进行中</Select.Option>
              <Select.Option :value="2">已结束</Select.Option>
            </Select>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, h, onMounted } from "vue";
import {
  Button,
  Modal,
  Form,
  FormItem,
  Input,
  Textarea,
  DatePicker,
  TimePicker,
  Row,
  Col,
  Checkbox,
  Empty,
  Select,
  Tag,
  message,
} from "ant-design-vue";
import {
  LeftOutlined,
  RightOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import dayjs, { Dayjs } from "dayjs";
import type { CalendarEvent, CalendarProps, CalendarEmits } from "./types";

// Props
const props = withDefaults(defineProps<CalendarProps>(), {
  events: () => [],
  showSidebar: true,
  showActions: true,
  showCheckbox: true,
});

// Emits
const emit = defineEmits<CalendarEmits>();

// 响应式数据
const currentDate = ref(dayjs());
const selectedDate = ref<string | null>(null);
const selectedEvents = ref<string[]>([]);
const showAddModal = ref(false);
const isEditing = ref(false);
const editingEventId = ref<string | null>(null);

// 表单数据
const eventForm = ref({
  title: "",
  description: "",
  joiners: "",
  sdate: null as Dayjs | null,
  edate: null as Dayjs | null,
  startTime: null as Dayjs | null,
  endTime: null as Dayjs | null,
  status: 0,
});

const eventFormRef = ref();
const eventRules = {
  title: [{ required: true, message: "请输入活动标题", trigger: "blur" }],
  description: [{ required: true, message: "请输入活动描述", trigger: "blur" }],
  joiners: [{ required: true, message: "请输入参与人员", trigger: "blur" }],
  sdate: [{ required: true, message: "请选择开始时间", trigger: "change" }],
  edate: [
    { required: true, message: "请选择结束时间", trigger: "change" },
    {
      validator: (rule: any, value: any) => {
        if (value && eventForm.value.sdate) {
          const startDate = dayjs(eventForm.value.sdate);
          const endDate = dayjs(value);
          if (endDate.isBefore(startDate)) {
            return Promise.reject("结束日期不能早于开始日期");
          }
        }
        return Promise.resolve();
      },
      trigger: "change",
    },
  ],
  startTime: [{ required: true, message: "请选择开始时间", trigger: "change" }],
  endTime: [
    { required: true, message: "请选择结束时间", trigger: "change" },
    {
      validator: (rule: any, value: any) => {
        if (value && eventForm.value.startTime) {
          const startTime = dayjs(eventForm.value.startTime);
          const endTime = dayjs(value);
          if (endTime.isBefore(startTime)) {
            return Promise.reject("结束时间不能早于开始时间");
          }
        }
        return Promise.resolve();
      },
      trigger: "change",
    },
  ],
  status: [{ required: true, message: "请选择活动状态", trigger: "change" }],
};

// 星期标题
const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

// 计算属性
const currentMonthYear = computed(() => {
  return currentDate.value.format("YYYY年 M月");
});

const calendarDates = computed(() => {
  const year = currentDate.value.year();
  const month = currentDate.value.month();

  const firstDay = dayjs().year(year).month(month).startOf("month");
  const lastDay = dayjs().year(year).month(month).endOf("month");
  const startDate = firstDay.startOf("week");
  const endDate = lastDay.endOf("week");

  const dates = [];
  let current = startDate;

  while (current.isBefore(endDate) || current.isSame(endDate, "day")) {
    dates.push({
      date: current.format("YYYY-MM-DD"),
      day: current.date(),
      isCurrentMonth: current.month() === month,
      isToday: current.isSame(dayjs(), "day"),
      key: current.format("YYYY-MM-DD"),
    });
    current = current.add(1, "day");
  }

  return dates;
});

const filteredEvents = computed(() => {
  console.log("Calendar组件接收到的events:", props.events); // 调试日志
  if (selectedDate.value) {
    const filtered = props.events.filter(
      (event) => event.date === selectedDate.value,
    );
    console.log("过滤后的事件:", filtered); // 调试日志
    return filtered;
  }
  console.log("返回所有事件:", props.events); // 调试日志
  return props.events;
});

const sortedEvents = computed(() => {
  return [...filteredEvents.value].sort((a, b) => {
    const dateA = dayjs(`${a.date} ${a.startTime}`);
    const dateB = dayjs(`${b.date} ${b.startTime}`);
    return dateA.isBefore(dateB) ? -1 : 1;
  });
});

// 方法
const previousMonth = () => {
  currentDate.value = currentDate.value.subtract(1, "month");
};

const nextMonth = () => {
  currentDate.value = currentDate.value.add(1, "month");
};

const selectDate = (date: string) => {
  selectedDate.value = date;
  selectedEvents.value = [];
};

const getEventsForDate = (date: string): CalendarEvent[] => {
  return props.events.filter((event) => event.date === date);
};

const formatDate = (date: string): string => {
  return dayjs(date).format("YYYY年M月D日 dddd");
};

const formatEventDate = (date: string): string => {
  return dayjs(date).format("M月D日");
};

// 获取状态颜色
const getStatusColor = (status: number): string => {
  switch (status) {
    case 0:
      return "orange"; // 未开始 - 橙色
    case 1:
      return "green"; // 进行中 - 绿色
    case 2:
      return "red"; // 已结束 - 红色
  }
};

// 获取状态文本
const getStatusText = (status: number): string => {
  switch (status) {
    case 0:
      return "未开始";
    case 1:
      return "进行中";
    case 2:
      return "已结束";
    default:
      return "未知";
  }
};

const toggleEventSelection = (eventId: string, checked: boolean) => {
  if (checked) {
    selectedEvents.value.push(eventId);
  } else {
    const index = selectedEvents.value.indexOf(eventId);
    if (index > -1) {
      selectedEvents.value.splice(index, 1);
    }
  }
};

const deleteMultiple = () => {
  if (selectedEvents.value.length > 0) {
    emit("delete-multiple", selectedEvents.value);
    selectedEvents.value = [];
  }
};

const editEvent = (event: CalendarEvent) => {
  isEditing.value = true;
  editingEventId.value = event.id;
  eventForm.value = {
    title: event.title,
    description: event.description || "",
    joiners: event.joiners || "",
    sdate: event.sdate ? dayjs(event.sdate) : null,
    edate: event.edate ? dayjs(event.edate) : null,
    startTime: event.startTime ? dayjs(event.startTime, "HH:mm") : null,
    endTime: event.endTime ? dayjs(event.endTime, "HH:mm") : null,
    status: Number(typeof event.status === "number" ? event.status : 0),
  };
  showAddModal.value = true;
};

const deleteEvent = (eventId: string) => {
  console.log("Calendar组件触发删除事件:", eventId); // 调试日志
  emit("delete", eventId);
};

const saveEvent = async () => {
  try {
    await eventFormRef.value.validate();

    // 判空保护
    if (!eventForm.value.sdate || !eventForm.value.edate) {
      message.error("请选择开始时间和结束时间");
      return;
    }

    // 日期验证：结束日期不能早于开始日期
    const startDate = dayjs(eventForm.value.sdate);
    const endDate = dayjs(eventForm.value.edate);
    if (endDate.isBefore(startDate)) {
      message.error("结束日期不能早于开始日期");
      return;
    }

    // 时间验证：如果选择了时间，结束时间不能早于开始时间
    if (eventForm.value.startTime && eventForm.value.endTime) {
      const startTime = dayjs(eventForm.value.startTime);
      const endTime = dayjs(eventForm.value.endTime);
      if (endTime.isBefore(startTime)) {
        message.error("结束时间不能早于开始时间");
        return;
      }
    }

    const eventData = {
      title: eventForm.value.title,
      description: eventForm.value.description,
      joiners: eventForm.value.joiners,
      sdate: eventForm.value.sdate.format("YYYY-MM-DD"),
      edate: eventForm.value.edate.format("YYYY-MM-DD"),
      startTime: eventForm.value.startTime
        ? eventForm.value.startTime.format("HH:mm")
        : "",
      endTime: eventForm.value.endTime
        ? eventForm.value.endTime.format("HH:mm")
        : "",
      status: Number(eventForm.value.status),
    };

    if (isEditing.value && editingEventId.value) {
      emit("edit", { id: editingEventId.value, ...eventData });
    } else {
      emit("add", eventData);
    }

    showAddModal.value = false;
    resetForm();
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};

const cancelEdit = () => {
  showAddModal.value = false;
  resetForm();
};

const resetForm = () => {
  eventForm.value = {
    title: "",
    description: "",
    joiners: "",
    sdate: null,
    edate: null,
    startTime: null,
    endTime: null,
    status: 0,
  };
  isEditing.value = false;
  editingEventId.value = null;
};

// 初始化
onMounted(() => {
  if (!selectedDate.value) {
    selectedDate.value = dayjs().format("YYYY-MM-DD");
  }
});
</script>

<style lang="less" scoped>
.calendar-container {
  display: flex;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.calendar-sidebar {
  width: 300px;
  border-right: 1px solid #f0f0f0;
  padding: 20px;
  background: #fafafa;

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      color: #333;
    }
  }

  .month-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .current-month {
      font-weight: 600;
      color: #333;
    }
  }

  .calendar-grid {
    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 1px;
      margin-bottom: 8px;

      .weekday {
        padding: 8px;
        text-align: center;
        font-weight: 600;
        background: #f5f5f5;
        color: #666;
        font-size: 12px;
      }
    }

    .days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 1px;
      background: #f0f0f0;

      .day {
        background: #fff;
        min-height: 60px;
        padding: 8px;
        cursor: pointer;
        transition: all 0.2s;
        position: relative;

        &:hover {
          background: #f8f9fa;
        }

        &.other-month {
          background: #fafafa;
          color: #ccc;
        }

        &.today {
          background: #e6f7ff;
          border: 2px solid #1890ff;
        }

        &.selected {
          background: #1890ff;
          color: #fff;
        }

        &.has-events {
          background: #f0f8ff;
        }

        .day-number {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .event-indicators {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;

          .event-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
          }
        }
      }
    }
  }
}

.calendar-main {
  flex: 1;
  padding: 20px;

  .main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .header-left {
      h2 {
        margin: 0 0 4px 0;
        color: #333;
      }

      .event-count {
        color: #666;
        font-size: 14px;
      }
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }
  }

  .events-list {
    .event-item {
      display: flex;
      align-items: flex-start;
      padding: 16px;
      border: 1px solid #f0f0f0;
      border-radius: 8px;
      margin-bottom: 12px;
      transition: all 0.2s;

      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      &.completed {
        opacity: 0.6;
        background: #f9f9f9;
      }

      .event-checkbox {
        margin-right: 12px;
        margin-top: 2px;
      }

      .event-content {
        flex: 1;
        position: relative;

        .event-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;

          .event-time {
            font-weight: 600;
            color: #333;
          }

          .event-date {
            color: #666;
            font-size: 12px;
          }
        }

        .event-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }

        .event-description {
          color: #666;
          font-size: 14px;
          line-height: 1.5;
        }

        .event-joiners {
          color: #888;
          font-size: 12px;
          line-height: 1.4;
          margin-top: 4px;
        }

        .event-status {
          margin-top: 8px;
        }
      }

      .event-actions {
        display: flex;
        gap: 8px;
        margin-left: 12px;
      }
    }

    .no-events {
      text-align: center;
      padding: 40px;
      color: #999;
    }
  }
}

.calendar-modal-form-wrapper {
  padding: 24px 32px 0 32px;
}
</style>
