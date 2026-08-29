<template>
  <PageWrapper dense contentFullHeight>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userId'">
          <CZAvatar :userId="record.userId" />
        </template>
        <template v-if="column.dataIndex === 'username'">
          <span
            class="cursor-pointer font-medium"
            :class="getUsernameClassByRole(record.role)"
            @click="showUserModal(record)"
          >
            {{ record.username }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑成员信息',
                onClick: handleEdit.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <Modal
      v-model:open="editModalVisible"
      title="修改成员权限"
      @ok="handleSaveRole"
      :confirmLoading="isSaving"
    >
      <div class="pt-4 px-4">
        <div class="mb-4">
          <span class="inline-block w-20 text-right mr-4">成员：</span>
          <span class="font-bold">{{ currentUser?.username }}</span>
        </div>
        <div class="mb-4">
          <span class="inline-block w-20 text-right mr-4">角色：</span>
          <Select v-model:value="editRole" class="w-48">
            <SelectOptGroup>
              <template #label>
                <span>创智团队</span>
              </template>
              <SelectOption value="ADMIN">创智管理员</SelectOption>
              <SelectOption value="CZ_MEMBER">创智成员</SelectOption>
            </SelectOptGroup>
            <SelectOptGroup>
              <template #label>
                <span>普通用户</span>
              </template>
              <SelectOption value="COMMON">普通用户</SelectOption>
            </SelectOptGroup>
          </Select>
        </div>
        <div class="mb-4">
          <span class="inline-block w-20 text-right mr-4">身份：</span>
          <Select v-model:value="editMemberType" class="w-48">
            <SelectOption value="STUDENT">在读成员</SelectOption>
            <SelectOption value="GRADUATED">已毕业</SelectOption>
            <SelectOption value="ADVISOR">指导老师</SelectOption>
          </Select>
        </div>
        <div>
          <span class="inline-block w-20 text-right mr-4">入学年份：</span>
          <Select v-model:value="editAdmissionYear" class="w-48" :disabled="editMemberType === 'ADVISOR'">
            <SelectOption
              v-for="option in admissionYearOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </SelectOption>
          </Select>
        </div>
      </div>
    </Modal>
  </PageWrapper>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BasicTable, useTable, TableAction } from "@/components/Table";
import { PageWrapper } from "@/components/Page";
import { Modal, Select, SelectOption, SelectOptGroup, message } from "ant-design-vue";
import { getAdminUserPage, setUserRole } from "@/api/sys/user";
import { GetUserInfoModel } from "@/api/sys/model/userModel";
import { columns, searchFormSchema } from "./member.data";
import CZAvatar from "@/components/cz/CZAvatar.vue";
import { getUsernameClassByRole } from "@/utils/getUsernameClass";
import showUserModal from "@/components/cz/UserModal";
import { getAdmissionYearOptions } from "@/utils/memberProfile";

const editModalVisible = ref(false);
const isSaving = ref(false);
const currentUser = ref<GetUserInfoModel | null>(null);
const editRole = ref<string>("");
const editMemberType = ref<"STUDENT" | "GRADUATED" | "ADVISOR">("STUDENT");
const editAdmissionYear = ref<number | undefined>();
const admissionYearOptions = getAdmissionYearOptions();

const [registerTable, { reload }] = useTable({
  title: "成员管理",
  api: async (params) => {
    return await getAdminUserPage({
      page: Number(params.page || 1),
      pageSize: Number(params.pageSize || 10),
      username: params.username || undefined,
      role: params.role || undefined,
      admissionYear: params.admissionYear ? Number(params.admissionYear) : undefined,
      memberType: params.memberType || undefined,
      major: params.major || undefined,
    });
  },
  columns,
  formConfig: {
    labelWidth: 80,
    schemas: searchFormSchema,
    autoSubmitOnEnter: true,
  },
  useSearchForm: true,
  showTableSetting: true,
  bordered: true,
  showIndexColumn: false,
  actionColumn: {
    width: 80,
    title: "操作",
    dataIndex: "action",
  },
});

function handleEdit(record: GetUserInfoModel) {
  currentUser.value = record;
  editRole.value = record.role;
  editMemberType.value = (record.memberType || "STUDENT") as "STUDENT" | "GRADUATED" | "ADVISOR";
  editAdmissionYear.value = record.admissionYear;
  editModalVisible.value = true;
}

async function handleSaveRole() {
  if (!currentUser.value) return;
  if (editMemberType.value !== "ADVISOR" && !editAdmissionYear.value) {
    message.warning("请先选择入学年份");
    return;
  }
  try {
    isSaving.value = true;
    await setUserRole(Number(currentUser.value.userId), {
      role: editRole.value,
      memberType: editMemberType.value,
      admissionYear: editMemberType.value === "ADVISOR" ? undefined : editAdmissionYear.value,
    });
    message.success("成员信息修改成功");
    editModalVisible.value = false;
    reload();
  } catch (error) {
    // 错误已由 axios 拦截器处理
  } finally {
    isSaving.value = false;
  }
}
</script>
