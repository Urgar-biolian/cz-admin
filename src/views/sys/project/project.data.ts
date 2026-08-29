import { BasicColumn, FormSchema } from "@/components/Table";

export const columns: BasicColumn[] = [
  {
    title: "项目名称",
    dataIndex: "title",
    width: 200,
  },
  {
    title: "技术栈",
    dataIndex: "stack",
    width: 200,
  },
  {
    title: "成员",
    dataIndex: "members",
    width: 200,
  },
  {
    title: "描述",
    dataIndex: "content",
    width: 300,
  },
  {
    title: "更新时间",
    dataIndex: "updatedAt",
    width: 180,
    customRender: ({ record }) => {
      if (!record.updatedAt) return "-";
      return record.updatedAt.replace("T", " ").replace("Z", "").split(".")[0];
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: "title",
    label: "项目名称",
    component: "Input",
    colProps: { span: 8 },
  },
  {
    field: "stack",
    label: "技术栈",
    component: "Input",
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: "title",
    label: "标题",
    required: true,
    component: "Input",
  },
  {
    field: "stack",
    label: "技术栈",
    required: true,
    component: "Input",
  },
  {
    field: "content",
    label: "描述",
    required: true,
    component: "InputTextArea",
    componentProps: {
      rows: 4,
    },
  },
  {
    field: "members",
    label: "成员",
    helpMessage: ["支持多选成员，保存时自动转换为成员 ID 列表"],
    required: true,
    component: "Select",
    componentProps: {
      mode: "multiple",
      options: [],
    },
  },
];
