import { BasicColumn, FormSchema } from "@/components/Table";
import { getUsernameClassByRole } from "@/utils/getUsernameClass";
import { h } from "vue";
import { Tag } from "ant-design-vue";
import { getMemberAcademicLabel } from "@/utils/memberProfile";
import { getAdmissionYearOptions } from "@/utils/memberProfile";

const admissionYearOptions = [
  { label: "全部", value: undefined },
  ...getAdmissionYearOptions().map((item) => ({
    label: item.label,
    value: item.value,
  })),
];

export const columns: BasicColumn[] = [
  {
    title: "头像",
    dataIndex: "userId",
    width: 80,
  },
  {
    title: "用户名",
    dataIndex: "username",
    width: 150,
  },
  {
    title: "角色",
    dataIndex: "role",
    width: 150,
    customRender: ({ record }) => {
      const role = record.role;
      const roleMap: Record<string, { color: string; text: string }> = {
        ADMIN: { color: "error", text: "创智管理员" },
        CZ_MEMBER: { color: "processing", text: "创智成员" },
        COMMON: { color: "default", text: "普通用户" },
        super: { color: "error", text: "超级管理员" },
      };
      const info = roleMap[role] || { color: "default", text: role };
      return h(Tag, { color: info.color }, () => info.text);
    },
  },
  {
    title: "邮箱",
    dataIndex: "email",
    width: 200,
  },
  {
    title: "学籍信息",
    dataIndex: "grade",
    width: 150,
    customRender: ({ record }) => {
      const academicLabel = getMemberAcademicLabel(record);
      if (academicLabel === "-" && !record.major) return "-";
      return `${academicLabel} ${record.major || ""}`.trim();
    },
  },
  {
    title: "积分",
    dataIndex: "score",
    width: 100,
  },
  {
    title: "加入时间",
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
    field: "username",
    label: "用户名",
    component: "Input",
    colProps: { span: 6 },
  },
  {
    field: "role",
    label: "角色",
    component: "Select",
    componentProps: {
      options: [
        { label: "所有", value: "" },
        { label: "创智管理员", value: "ADMIN" },
        { label: "创智成员", value: "CZ_MEMBER" },
        { label: "普通用户", value: "COMMON" },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: "admissionYear",
    label: "届别",
    component: "Select",
    componentProps: {
      options: admissionYearOptions,
    },
    colProps: { span: 6 },
  },
  {
    field: "memberType",
    label: "身份",
    component: "Select",
    componentProps: {
      options: [
        { label: "全部", value: "" },
        { label: "在读成员", value: "STUDENT" },
        { label: "已毕业", value: "GRADUATED" },
        { label: "指导老师", value: "ADVISOR" },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: "major",
    label: "专业",
    component: "Input",
    colProps: { span: 6 },
  },
];
