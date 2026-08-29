import { BasicColumn, FormSchema } from "@/components/Table";
import { h } from "vue";
import { Tag } from "ant-design-vue";

export const columns: BasicColumn[] = [
  {
    title: "ID",
    dataIndex: "id",
    width: 80,
  },
  {
    title: "分类",
    dataIndex: "category",
    width: 120,
  },
  {
    title: "内容",
    dataIndex: "content",
    width: 300,
    customRender: ({ record }) => {
      const title = record.title ? `【${record.title}】` : "";
      const content = record.content || "";
      const text = `${title}${content}`;
      return text.length > 50 ? text.slice(0, 50) + "..." : text;
    },
  },
  {
    title: "作者",
    dataIndex: "user.username",
    width: 120,
    customRender: ({ record }) => {
      return record.user?.username || `用户ID: ${record.userId}`;
    },
  },
  {
    title: "状态",
    dataIndex: "status",
    width: 150,
    customRender: ({ record }) => {
      const tags: any[] = [];
      if (record.isPinned) {
        tags.push(h(Tag, { color: "success" }, () => "置顶"));
      }
      if (record.isFeatured) {
        tags.push(h(Tag, { color: "warning" }, () => "精华"));
      }
      if (tags.length === 0) {
        tags.push(h(Tag, { color: "default" }, () => "正常"));
      }
      return h("div", { class: "flex gap-1" }, tags);
    },
  },
  {
    title: "发布时间",
    dataIndex: "createdAt",
    width: 180,
    customRender: ({ record }) => {
      if (!record.createdAt) return "-";
      return record.createdAt.replace("T", " ").replace("Z", "").split(".")[0];
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: "author",
    label: "作者",
    component: "Input",
    colProps: { span: 6 },
  },
  {
    field: "content",
    label: "内容关键字",
    component: "Input",
    colProps: { span: 6 },
  },
  {
    field: "category",
    label: "分类",
    component: "Input",
    colProps: { span: 6 },
  },
  {
    field: "isPinned",
    label: "置顶状态",
    component: "Select",
    componentProps: {
      options: [
        { label: "全部", value: "" },
        { label: "已置顶", value: "true" },
        { label: "未置顶", value: "false" },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: "isFeatured",
    label: "精华状态",
    component: "Select",
    componentProps: {
      options: [
        { label: "全部", value: "" },
        { label: "已加精", value: "true" },
        { label: "未加精", value: "false" },
      ],
    },
    colProps: { span: 6 },
  },
];
