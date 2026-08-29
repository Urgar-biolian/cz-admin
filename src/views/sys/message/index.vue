<template>
  <PageWrapper dense contentFullHeight>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button type="primary" @click="handleCreate" class="flex items-center">
          <Icon icon="material-symbols:add" size="20" class="mr-1" />
          添加通知
        </Button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除',
                popConfirm: {
                  title: '是否确认删除该通知？',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <MessageModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts" setup>
import { BasicTable, useTable, TableAction } from "@/components/Table";
import { PageWrapper } from "@/components/Page";
import { Button } from "ant-design-vue";
import Icon from "@/components/Icon/Icon.vue";
import { getMsgApi, removeMsgApi } from "@/api/sys/message";
import { columns, searchFormSchema } from "./message.data";
import { useModal } from "@/components/Modal";
import MessageModal from "./MessageModal.vue";
import { useMessage } from "@/hooks/web/useMessage";
import { sortByCreated } from "@/utils/sortByCreated";

const { notification } = useMessage();
const [registerModal, { openModal }] = useModal();

const [registerTable, { reload }] = useTable({
  title: "通知列表",
  api: async (params) => {
    let data = await getMsgApi();
    
    data = sortByCreated(data);

    if (params.title) {
      data = data.filter((item: any) => item.title.includes(params.title));
    }
    if (params.content) {
      data = data.filter((item: any) => item.content.includes(params.content));
    }

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const total = data.length;
    const items = data.slice((page - 1) * pageSize, page * pageSize);

    return { items, total };
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
    width: 100,
    title: "操作",
    dataIndex: "action",
  },
});

function handleCreate() {
  openModal(true, {
    isUpdate: false,
  });
}

function handleEdit(record: Recordable) {
  openModal(true, {
    record,
    isUpdate: true,
  });
}

async function handleDelete(record: Recordable) {
  try {
    await removeMsgApi(record.id);
    notification.success({ message: `已删除通知：${record.title}` });
    reload();
  } catch (error) {
    //
  }
}

function handleSuccess() {
  reload();
}
</script>
