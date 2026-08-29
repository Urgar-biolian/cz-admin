<template>
  <PageWrapper dense contentFullHeight>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button type="primary" @click="handleCreate" class="flex items-center">
          <Icon icon="material-symbols:add" size="20" class="mr-1" />
          添加项目
        </Button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'members'">
          <div class="flex flex-wrap gap-1">
            <CZAvatar v-for="u of record.members.split(',').filter(id => id.trim() !== '')" :key="u" :userId="u" />
          </div>
        </template>
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
                  title: '是否确认删除该项目？',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <ProjectModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts" setup>
import { BasicTable, useTable, TableAction } from "@/components/Table";
import { PageWrapper } from "@/components/Page";
import { Button } from "ant-design-vue";
import Icon from "@/components/Icon/Icon.vue";
import { getProjApi, removeProjApi } from "@/api/sys/project";
import { columns, searchFormSchema } from "./project.data";
import CZAvatar from "@/components/cz/CZAvatar.vue";
import { useModal } from "@/components/Modal";
import ProjectModal from "./ProjectModal.vue";
import { useMessage } from "@/hooks/web/useMessage";
import { sortByCreated } from "@/utils/sortByCreated";

const { notification } = useMessage();
const [registerModal, { openModal }] = useModal();

const [registerTable, { reload }] = useTable({
  title: "项目列表",
  api: async (params) => {
    let data = await getProjApi();
    
    data = sortByCreated(data);

    if (params.title) {
      data = data.filter((item: any) => item.title.includes(params.title));
    }
    if (params.stack) {
      data = data.filter((item: any) => item.stack.includes(params.stack));
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
    await removeProjApi(record.id);
    notification.success({ message: `已删除项目：${record.title}` });
    reload();
  } catch (error) {
    //
  }
}

function handleSuccess() {
  reload();
}
</script>
