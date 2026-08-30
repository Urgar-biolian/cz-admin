<template>
  <PageWrapper dense contentFullHeight>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button type="primary" @click="handleGenerate" class="flex items-center">
          <Icon icon="ant-design:qrcode-outlined" size="20" class="mr-1" />
          生成邀请码
        </Button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'ant-design:copy-outlined',
                tooltip: '复制',
                onClick: handleCopy.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除',
                popConfirm: {
                  title: '是否确认删除该邀请码？',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <InvitationModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts" setup>
import { BasicTable, useTable, TableAction } from "@/components/Table";
import { PageWrapper } from "@/components/Page";
import { Button } from "ant-design-vue";
import Icon from "@/components/Icon/Icon.vue";
import { getInvitationApi, deleteInvitationApi } from "@/api/sys/invitation";
import { columns } from "./invitation.data";
import { useModal } from "@/components/Modal";
import InvitationModal from "./InvitationModal.vue";
import { useMessage } from "@/hooks/web/useMessage";
import { copyText } from "@/utils/copyTextToClipboard";

const { notification } = useMessage();
const [registerModal, { openModal }] = useModal();

const [registerTable, { reload }] = useTable({
  title: "邀请码列表",
  api: async (params) => {
    const data = await getInvitationApi();

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const total = data.length;
    const items = data.slice((page - 1) * pageSize, page * pageSize);

    return { items, total };
  },
  columns,
  showTableSetting: true,
  bordered: true,
  showIndexColumn: false,
  actionColumn: {
    width: 120,
    title: "操作",
    dataIndex: "action",
  },
});

function handleGenerate() {
  openModal(true, {});
}

async function handleDelete(record: Recordable) {
  try {
    await deleteInvitationApi(record.id);
    notification.success({ message: `已删除邀请码：${record.code}` });
    reload();
  } catch (error) {
    //
  }
}

function handleCopy(record: Recordable) {
  copyText(record.code, "邀请码已复制到剪贴板!");
}

function handleSuccess() {
  reload();
}
</script>
