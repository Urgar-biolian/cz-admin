import { BasicColumn, FormSchema } from "@/components/Table";

export const columns: BasicColumn[] = [
  {
    title: "通知标题",
    dataIndex: "title",
    width: 250,
  },
  {
    title: "通知内容",
    dataIndex: "content",
    width: 400,
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
    label: "标题",
    component: "Input",
    colProps: { span: 8 },
  },
  {
    field: "content",
    label: "内容",
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
    field: "content",
    label: "内容",
    required: true,
    component: "InputTextArea",
    componentProps: {
      rows: 6,
    },
  },
];
