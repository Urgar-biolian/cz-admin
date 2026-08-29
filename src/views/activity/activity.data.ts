import { BasicColumn, FormSchema } from "@/components/Table";
import { h } from "vue";
import { Tag } from "ant-design-vue";

export const columns: BasicColumn[] = [
  {
    title: "活动简介",
    dataIndex: "intro",
    width: 200,
  },
  {
    title: "状态",
    dataIndex: "status",
    width: 100,
    customRender: ({ record }) => {
      const statusMap = {
        0: { color: "default", text: "未开始" },
        1: { color: "processing", text: "进行中" },
        2: { color: "success", text: "已结束" },
      };
      const info = statusMap[record.status] || { color: "default", text: "未知" };
      return h(Tag, { color: info.color }, () => info.text);
    },
  },
  {
    title: "开始时间",
    dataIndex: "sdate",
    width: 150,
  },
  {
    title: "结束时间",
    dataIndex: "edate",
    width: 150,
  },
  {
    title: "参与人员",
    dataIndex: "joiners",
    width: 200,
    customRender: ({ record }) => {
      const joiners = record.joiners ? record.joiners.split(",").length : 0;
      return `${joiners} 人`;
    },
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    width: 160,
    customRender: ({ record }) => {
      if (!record.createdAt) return "-";
      return record.createdAt.replace("T", " ").replace("Z", "").split(".")[0];
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: "intro",
    label: "活动简介",
    component: "Input",
    colProps: { span: 6 },
  },
  {
    field: "status",
    label: "活动状态",
    component: "Select",
    componentProps: {
      options: [
        { label: "未开始", value: 0 },
        { label: "进行中", value: 1 },
        { label: "已结束", value: 2 },
      ],
    },
    colProps: { span: 6 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: "intro",
    label: "活动简介",
    required: true,
    component: "Input",
  },
  {
    field: "status",
    label: "活动状态",
    required: true,
    component: "Select",
    componentProps: {
      options: [
        { label: "未开始", value: 0 },
        { label: "进行中", value: 1 },
        { label: "已结束", value: 2 },
      ],
    },
  },
  {
    field: "sdate",
    label: "开始时间",
    required: true,
    component: "Input",
    helpMessage: ["建议格式：YYYY-MM-DD HH:mm"],
  },
  {
    field: "edate",
    label: "结束时间",
    required: true,
    component: "Input",
    helpMessage: ["建议格式：YYYY-MM-DD HH:mm"],
  },
  {
    field: "detail",
    label: "活动详情",
    required: true,
    component: "InputTextArea",
    componentProps: {
      rows: 4,
    },
  },
  {
    field: "joiners",
    label: "参与人员",
    component: "Select",
    componentProps: {
      mode: "multiple",
      options: [],
    },
    helpMessage: ["支持多选成员，保存时自动转换为参与者 ID 列表"],
  },
];
