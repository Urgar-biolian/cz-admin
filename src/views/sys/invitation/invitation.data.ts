import { BasicColumn, FormSchema } from "@/components/Table";

export const columns: BasicColumn[] = [
  {
    title: "邀请码",
    dataIndex: "code",
    width: 160,
  },
  {
    title: "可用次数",
    dataIndex: "maxUses",
    width: 100,
  },
  {
    title: "已用次数",
    dataIndex: "usedCount",
    width: 100,
  },
  {
    title: "有效期至",
    dataIndex: "expiresAt",
    width: 180,
    customRender: ({ record }) => formatDate(record.expiresAt),
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    width: 180,
    customRender: ({ record }) => formatDate(record.createdAt),
  },
];

export const formSchema: FormSchema[] = [
  {
    field: "maxUses",
    label: "可用次数",
    required: true,
    component: "InputNumber",
    defaultValue: 1,
    componentProps: {
      min: 1,
      max: 100,
      precision: 0,
      style: { width: "100%" },
    },
  },
  {
    field: "expireDays",
    label: "有效期(天)",
    required: true,
    component: "InputNumber",
    defaultValue: 7,
    componentProps: {
      min: 1,
      max: 365,
      precision: 0,
      style: { width: "100%" },
    },
  },
];

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  return dateStr.replace("T", " ").replace("Z", "").split(".")[0];
}
