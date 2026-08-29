<template>
  <PageWrapper dense contentFullHeight>
    <Row :gutter="[12, 12]" class="mb-4"> <!-- //Ugar-biolian -->
      <Col :xs="24" :sm="12" :md="6"> <!-- //Ugar-biolian -->
        <Card size="small"> <!-- //Ugar-biolian -->
          <Statistic title="当前页评论" :value="commentStats.total" /> <!-- //Ugar-biolian -->
        </Card> <!-- //Ugar-biolian -->
      </Col> <!-- //Ugar-biolian -->
      <Col :xs="24" :sm="12" :md="6"> <!-- //Ugar-biolian -->
        <Card size="small"> <!-- //Ugar-biolian -->
          <Statistic title="置顶评论" :value="commentStats.pinned" /> <!-- //Ugar-biolian -->
        </Card> <!-- //Ugar-biolian -->
      </Col> <!-- //Ugar-biolian -->
      <Col :xs="24" :sm="12" :md="6"> <!-- //Ugar-biolian -->
        <Card size="small"> <!-- //Ugar-biolian -->
          <Statistic title="精华评论" :value="commentStats.featured" /> <!-- //Ugar-biolian -->
        </Card> <!-- //Ugar-biolian -->
      </Col> <!-- //Ugar-biolian -->
      <Col :xs="24" :sm="12" :md="6"> <!-- //Ugar-biolian -->
        <Card size="small"> <!-- //Ugar-biolian -->
          <Statistic title="活跃作者" :value="commentStats.authors" /> <!-- //Ugar-biolian -->
        </Card> <!-- //Ugar-biolian -->
      </Col> <!-- //Ugar-biolian -->
    </Row> <!-- //Ugar-biolian -->

    <Card size="small" class="mb-4"> <!-- //Ugar-biolian -->
      <Space direction="vertical" size="small" class="w-full"> <!-- //Ugar-biolian -->
        <Space wrap> <!-- //Ugar-biolian -->
          <span class="text-sm text-gray-500">作者快捷筛选</span> <!-- //Ugar-biolian -->
          <Button size="small" @click="clearQuickFilters">清空筛选</Button> <!-- //Ugar-biolian -->
          <Tag
            v-for="item in authorQuickOptions"
            :key="`author-${item.value}`"
            :color="activeQuickAuthor === item.value ? 'processing' : 'default'"
            class="cursor-pointer"
            @click="applyQuickFilter('author', item.value)"
          >
            {{ item.label }}
          </Tag>
          <span v-if="authorQuickOptions.length === 0" class="text-sm text-gray-400">
            当前页暂无作者数据
          </span>
        </Space>
        <Space wrap> <!-- //Ugar-biolian -->
          <span class="text-sm text-gray-500">分类快捷筛选</span> <!-- //Ugar-biolian -->
          <Tag
            v-for="item in categoryQuickOptions"
            :key="`category-${item.value}`"
            :color="activeQuickCategory === item.value ? 'processing' : 'default'"
            class="cursor-pointer"
            @click="applyQuickFilter('category', item.value)"
          >
            {{ item.label }}
          </Tag>
          <span v-if="categoryQuickOptions.length === 0" class="text-sm text-gray-400">
            当前页暂无分类数据
          </span>
        </Space>
      </Space>
    </Card> <!-- //Ugar-biolian -->

    <BasicTable @register="registerTable">
      <template #toolbar>
        <Space wrap>
          <Button
            type="primary"
            :disabled="selectedRows.length === 0"
            @click="handleBatchUpdate('isPinned', true)"
          >
            批量置顶
          </Button>
          <Button
            :disabled="selectedRows.length === 0"
            @click="handleBatchUpdate('isPinned', false)"
          >
            批量取消置顶
          </Button>
          <Button
            type="primary"
            ghost
            :disabled="selectedRows.length === 0"
            @click="handleBatchUpdate('isFeatured', true)"
          >
            批量加精
          </Button>
          <Button
            :disabled="selectedRows.length === 0"
            @click="handleBatchUpdate('isFeatured', false)"
          >
            批量取消精华
          </Button>
          <Button
            danger
            :disabled="selectedRows.length === 0"
            @click="handleBatchDelete"
          >
            批量删除
          </Button>
          <Button
            :disabled="selectedRows.length === 0"
            @click="openBatchCategoryModal"
          >
            批量改分类
          </Button>
        </Space>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'ant-design:eye-outlined',
                tooltip: '查看详情',
                onClick: handleViewDetail.bind(null, record),
              },
              {
                icon: record.isPinned ? 'ant-design:arrow-down-outlined' : 'ant-design:arrow-up-outlined',
                tooltip: record.isPinned ? '取消置顶' : '设为置顶',
                onClick: handleTogglePin.bind(null, record),
              },
              {
                icon: record.isFeatured ? 'ant-design:star-filled' : 'ant-design:star-outlined',
                tooltip: record.isFeatured ? '取消精华' : '设为精华',
                onClick: handleToggleFeature.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除评论',
                popConfirm: {
                  title: '确定要删除这条评论吗？',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <Drawer
      v-model:open="detailVisible"
      title="评论详情"
      width="560"
      placement="right"
    >
      <template v-if="detailRecord">
        <Descriptions :column="1" bordered size="small">
          <DescriptionsItem label="标题">
            {{ detailRecord.title || "未命名主题" }}
          </DescriptionsItem>
          <DescriptionsItem label="作者">
            <Space wrap> <!-- //Ugar-biolian -->
              <span>{{ getCommentAuthorName(detailRecord) }}</span> <!-- //Ugar-biolian -->
              <Button size="small" type="link" @click="handleFilterByCurrentAuthor"> <!-- //Ugar-biolian -->
                按作者筛选 <!-- //Ugar-biolian -->
              </Button> <!-- //Ugar-biolian -->
            </Space> <!-- //Ugar-biolian -->
          </DescriptionsItem>
          <DescriptionsItem label="分类">
            {{ detailRecord.category || "综合讨论" }}
          </DescriptionsItem>
          <DescriptionsItem label="状态">
            <Space wrap>
              <Tag v-if="detailRecord.isPinned" color="success">置顶</Tag>
              <Tag v-if="detailRecord.isFeatured" color="warning">精华</Tag>
              <Tag v-if="!detailRecord.isPinned && !detailRecord.isFeatured">正常</Tag>
            </Space>
          </DescriptionsItem>
          <DescriptionsItem label="标签">
            <Space wrap v-if="detailRecord.tags?.length">
              <Tag v-for="tag in detailRecord.tags" :key="tag">{{ tag }}</Tag>
            </Space>
            <span v-else>无</span>
          </DescriptionsItem>
          <DescriptionsItem label="内容">
            <div class="whitespace-pre-wrap break-all">{{ detailRecord.content }}</div>
          </DescriptionsItem>
          <DescriptionsItem label="引用内容" v-if="detailRecord.quote">
            <div class="rounded bg-gray-50 p-3 dark:bg-gray-800">
              <div class="mb-1 text-xs text-gray-500">
                {{ detailRecord.quote.user?.username || `用户ID: ${detailRecord.quote.userId}` }}
              </div>
              <div class="whitespace-pre-wrap break-all">
                {{ detailRecord.quote.content }}
              </div>
            </div>
          </DescriptionsItem>
          <DescriptionsItem label="互动数据">
            点赞 {{ detailRecord.likeCount || 0 }}，回复 {{ detailRecord.replyCount || 0 }}
          </DescriptionsItem>
          <DescriptionsItem label="发布时间">
            {{ formatDate(detailRecord.createdAt) }}
          </DescriptionsItem>
        </Descriptions>

        <div class="mt-4"> <!-- //Ugar-biolian -->
          <div class="mb-2 flex items-center justify-between"> <!-- //Ugar-biolian -->
            <div class="text-sm font-medium">同作者其他评论</div> <!-- //Ugar-biolian -->
            <Button size="small" type="link" @click="handleFilterByCurrentAuthor"> <!-- //Ugar-biolian -->
              查看该作者列表 <!-- //Ugar-biolian -->
            </Button> <!-- //Ugar-biolian -->
          </div> <!-- //Ugar-biolian -->
          <div v-if="sameAuthorComments.length" class="space-y-3"> <!-- //Ugar-biolian -->
            <div
              v-for="item in sameAuthorComments"
              :key="`same-author-${item.id}`"
              class="rounded border border-solid border-gray-200 p-3 dark:border-gray-700"
            >
              <div class="mb-2 flex items-start justify-between gap-3"> <!-- //Ugar-biolian -->
                <div> <!-- //Ugar-biolian -->
                  <div class="text-sm font-medium">{{ item.title || "未命名主题" }}</div> <!-- //Ugar-biolian -->
                  <div class="mt-1 text-xs text-gray-500"> <!-- //Ugar-biolian -->
                    {{ item.category || "综合讨论" }} · {{ formatDate(item.createdAt) }} <!-- //Ugar-biolian -->
                  </div> <!-- //Ugar-biolian -->
                </div> <!-- //Ugar-biolian -->
                <Button size="small" @click="handleViewDetail(item)">查看</Button> <!-- //Ugar-biolian -->
              </div> <!-- //Ugar-biolian -->
              <div class="text-sm text-gray-600 dark:text-gray-300"> <!-- //Ugar-biolian -->
                {{ getCommentSummary(item) }} <!-- //Ugar-biolian -->
              </div> <!-- //Ugar-biolian -->
            </div>
          </div>
          <Empty v-else description="当前页暂无该作者的其他评论" /> <!-- //Ugar-biolian -->
        </div> <!-- //Ugar-biolian -->

        <div class="mt-4">
          <div class="mb-2 text-sm font-medium">回复列表</div>
          <div v-if="detailRecord.replies?.length" class="space-y-3">
            <div
              v-for="reply in detailRecord.replies"
              :key="reply.id"
              class="rounded border border-solid border-gray-200 p-3 dark:border-gray-700"
            >
              <div class="mb-1 text-xs text-gray-500">
                {{ reply.user?.username || `用户ID: ${reply.userId}` }}
                <span class="ml-2">{{ formatDate(reply.createdAt) }}</span>
              </div>
              <div class="whitespace-pre-wrap break-all">{{ reply.content }}</div>
            </div>
          </div>
          <Empty v-else description="暂无回复" />
        </div>
      </template>
      <Empty v-else description="暂无详情数据" />
    </Drawer>

    <Modal
      v-model:open="categoryModalVisible"
      title="批量修改评论分类"
      :confirm-loading="batchCategoryLoading"
      @ok="handleBatchCategorySubmit"
      @cancel="closeBatchCategoryModal"
    >
      <Space direction="vertical" class="w-full">
        <div class="text-sm text-gray-500">
          已选择 {{ selectedRows.length }} 条评论，输入新的分类后将统一更新。
        </div>
        <Input
          v-model:value="batchCategory"
          placeholder="请输入新的分类名称"
          allow-clear
        />
        <Space wrap>
          <span class="text-sm text-gray-500">当前页常见分类</span>
          <Tag
            v-for="item in categoryQuickOptions"
            :key="`batch-category-${item.value}`"
            class="cursor-pointer"
            color="processing"
            @click="batchCategory = item.value"
          >
            {{ item.label }}
          </Tag>
        </Space>
      </Space>
    </Modal>
  </PageWrapper>
</template>

<script lang="ts" setup>
import { BasicTable, useTable, TableAction } from "@/components/Table";
import { PageWrapper } from "@/components/Page";
import {
  getCommentDetailApi,
  getCommentListApi,
  updateCommentApi,
  removeCommentApi,
  type CommentResultModel,
} from "@/api/sys/comment";
import { columns, searchFormSchema } from "./comment.data";
import { useMessage } from "@/hooks/web/useMessage";
import {
  Button,
  Card,
  Col,
  Descriptions,
  DescriptionsItem,
  Drawer,
  Empty,
  Input,
  Modal,
  Row,
  Space,
  Statistic,
  Tag,
} from "ant-design-vue";
import { computed, ref } from "vue";

const { notification } = useMessage();
const detailVisible = ref(false);
const detailRecord = ref<CommentResultModel | null>(null);
const selectedRows = ref<CommentResultModel[]>([]);
const currentPageItems = ref<CommentResultModel[]>([]); //Ugar-biolian
const authorQuickOptions = ref<{ label: string; value: string }[]>([]); //Ugar-biolian
const categoryQuickOptions = ref<{ label: string; value: string }[]>([]); //Ugar-biolian
const activeQuickAuthor = ref(""); //Ugar-biolian
const activeQuickCategory = ref(""); //Ugar-biolian
const categoryModalVisible = ref(false); //Ugar-biolian
const batchCategory = ref(""); //Ugar-biolian
const batchCategoryLoading = ref(false); //Ugar-biolian

const commentStats = computed(() => ({ //Ugar-biolian
  total: currentPageItems.value.length,
  pinned: currentPageItems.value.filter((item) => item.isPinned).length,
  featured: currentPageItems.value.filter((item) => item.isFeatured).length,
  authors: new Set(
    currentPageItems.value.map((item) => item.user?.username || `用户ID:${item.userId}`),
  ).size,
})); //Ugar-biolian

const sameAuthorComments = computed(() => { //Ugar-biolian
  if (!detailRecord.value) return []; //Ugar-biolian
  return currentPageItems.value //Ugar-biolian
    .filter( //Ugar-biolian
      (item) => //Ugar-biolian
        item.id !== detailRecord.value?.id && item.userId === detailRecord.value?.userId, //Ugar-biolian
    ) //Ugar-biolian
    .slice(0, 5); //Ugar-biolian
}); //Ugar-biolian

const [registerTable, { reload, clearSelectedRowKeys, getForm }] = useTable({
  title: "评论治理列表",
  api: async (params) => {
    try {
      const res = await getCommentListApi({
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        category: params.category || undefined,
        include_deleted: false,
        sort: "latest",
      });
      let items = res?.data || [];

      if (params.content) {
        items = items.filter((item) => item.content.includes(params.content));
      }
      if (params.author) {
        items = items.filter((item) =>
          (item.user?.username || "").includes(params.author),
        );
      }
      if (params.isPinned !== "" && params.isPinned !== undefined) {
        const pinned = params.isPinned === "true";
        items = items.filter((item) => item.isPinned === pinned);
      }
      if (params.isFeatured !== "" && params.isFeatured !== undefined) {
        const featured = params.isFeatured === "true";
        items = items.filter((item) => item.isFeatured === featured);
      }

      currentPageItems.value = items; //Ugar-biolian
      updateQuickOptions(items); //Ugar-biolian
      syncActiveQuickFilters(); //Ugar-biolian

      return {
        items,
        total: res?.meta?.total ?? items.length,
      };
    } catch (error) {
      currentPageItems.value = []; //Ugar-biolian
      authorQuickOptions.value = []; //Ugar-biolian
      categoryQuickOptions.value = []; //Ugar-biolian
      return { items: [], total: 0 };
    }
  },
  columns,
  formConfig: {
    labelWidth: 90,
    schemas: searchFormSchema,
    autoSubmitOnEnter: true,
  },
  useSearchForm: true,
  showTableSetting: true,
  bordered: true,
  showIndexColumn: false,
  rowSelection: {
    type: "checkbox",
    onChange: (_, rows) => {
      selectedRows.value = rows as CommentResultModel[];
    },
  },
  showSelectionBar: true,
  locale: {
    emptyText: "暂无可治理的评论数据",
  },
  actionColumn: {
    width: 200,
    title: "操作",
    dataIndex: "action",
  },
});

function formatDate(value?: string) {
  if (!value) return "-";
  return value.replace("T", " ").replace("Z", "").split(".")[0];
}

function getCommentAuthorName(comment?: CommentResultModel | null) { //Ugar-biolian
  if (!comment) return "-"; //Ugar-biolian
  return comment.user?.username || `用户ID: ${comment.userId}`; //Ugar-biolian
} //Ugar-biolian

function getCommentSummary(comment: CommentResultModel) { //Ugar-biolian
  const text = comment.content || ""; //Ugar-biolian
  return text.length > 80 ? `${text.slice(0, 80)}...` : text || "-"; //Ugar-biolian
} //Ugar-biolian

function updateQuickOptions(items: CommentResultModel[]) { //Ugar-biolian
  const authorMap = new Map<string, number>(); //Ugar-biolian
  const categoryMap = new Map<string, number>(); //Ugar-biolian

  items.forEach((item) => { //Ugar-biolian
    const author = item.user?.username || `用户ID: ${item.userId}`; //Ugar-biolian
    const category = item.category || "未分类"; //Ugar-biolian
    authorMap.set(author, (authorMap.get(author) || 0) + 1); //Ugar-biolian
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1); //Ugar-biolian
  }); //Ugar-biolian

  authorQuickOptions.value = Array.from(authorMap.entries()) //Ugar-biolian
    .sort((a, b) => b[1] - a[1]) //Ugar-biolian
    .slice(0, 8) //Ugar-biolian
    .map(([value, count]) => ({ label: `${value} (${count})`, value })); //Ugar-biolian

  categoryQuickOptions.value = Array.from(categoryMap.entries()) //Ugar-biolian
    .sort((a, b) => b[1] - a[1]) //Ugar-biolian
    .map(([value, count]) => ({ label: `${value} (${count})`, value })); //Ugar-biolian
} //Ugar-biolian

function syncActiveQuickFilters() { //Ugar-biolian
  try { //Ugar-biolian
    const values = getForm().getFieldsValue(); //Ugar-biolian
    activeQuickAuthor.value = values.author || ""; //Ugar-biolian
    activeQuickCategory.value = values.category || ""; //Ugar-biolian
  } catch (error) { //Ugar-biolian
    activeQuickAuthor.value = ""; //Ugar-biolian
    activeQuickCategory.value = ""; //Ugar-biolian
  } //Ugar-biolian
} //Ugar-biolian

async function resetSelectionAndReload() {
  clearSelectedRowKeys();
  selectedRows.value = [];
  await reload();
}

async function applyQuickFilter(field: "author" | "category", value: string) { //Ugar-biolian
  const isAuthorField = field === "author"; //Ugar-biolian
  const nextValue = //Ugar-biolian
    (isAuthorField ? activeQuickAuthor.value : activeQuickCategory.value) === value //Ugar-biolian
      ? "" //Ugar-biolian
      : value; //Ugar-biolian
  await getForm().setFieldsValue({ [field]: nextValue }); //Ugar-biolian
  if (isAuthorField) { //Ugar-biolian
    activeQuickAuthor.value = nextValue; //Ugar-biolian
  } else { //Ugar-biolian
    activeQuickCategory.value = nextValue; //Ugar-biolian
  } //Ugar-biolian
  await reload({ page: 1 }); //Ugar-biolian
} //Ugar-biolian

async function clearQuickFilters() { //Ugar-biolian
  activeQuickAuthor.value = ""; //Ugar-biolian
  activeQuickCategory.value = ""; //Ugar-biolian
  await getForm().setFieldsValue({ author: "", category: "" }); //Ugar-biolian
  await reload({ page: 1 }); //Ugar-biolian
} //Ugar-biolian

async function handleFilterByCurrentAuthor() { //Ugar-biolian
  const author = getCommentAuthorName(detailRecord.value); //Ugar-biolian
  if (!detailRecord.value || author === "-") return; //Ugar-biolian
  activeQuickAuthor.value = author; //Ugar-biolian
  await getForm().setFieldsValue({ author, category: activeQuickCategory.value || "" }); //Ugar-biolian
  await reload({ page: 1 }); //Ugar-biolian
  notification.success({ message: `已筛选作者：${author}` }); //Ugar-biolian
} //Ugar-biolian

function openBatchCategoryModal() { //Ugar-biolian
  if (selectedRows.value.length === 0) return; //Ugar-biolian
  batchCategory.value = ""; //Ugar-biolian
  categoryModalVisible.value = true; //Ugar-biolian
} //Ugar-biolian

function closeBatchCategoryModal() { //Ugar-biolian
  if (batchCategoryLoading.value) return; //Ugar-biolian
  categoryModalVisible.value = false; //Ugar-biolian
  batchCategory.value = ""; //Ugar-biolian
} //Ugar-biolian

async function handleBatchUpdate(
  field: "isPinned" | "isFeatured",
  value: boolean,
) {
  if (selectedRows.value.length === 0) return;
  await Promise.all(
    selectedRows.value.map((item) =>
      updateCommentApi(item.id, {
        [field]: value,
      }),
    ),
  );
  notification.success({
    message:
      field === "isPinned"
        ? value
          ? `已批量置顶 ${selectedRows.value.length} 条评论`
          : `已批量取消置顶 ${selectedRows.value.length} 条评论`
        : value
          ? `已批量加精 ${selectedRows.value.length} 条评论`
          : `已批量取消精华 ${selectedRows.value.length} 条评论`,
  });
  await resetSelectionAndReload();
}

async function handleBatchDelete() {
  if (selectedRows.value.length === 0) return;
  await Promise.all(selectedRows.value.map((item) => removeCommentApi(item.id)));
  notification.success({
    message: `已批量删除 ${selectedRows.value.length} 条评论`,
  });
  await resetSelectionAndReload();
}

async function handleBatchCategorySubmit() { //Ugar-biolian
  const nextCategory = batchCategory.value.trim(); //Ugar-biolian
  if (!nextCategory) { //Ugar-biolian
    notification.warning({ message: "请输入目标分类" }); //Ugar-biolian
    return; //Ugar-biolian
  } //Ugar-biolian

  batchCategoryLoading.value = true; //Ugar-biolian
  try { //Ugar-biolian
    await Promise.all( //Ugar-biolian
      selectedRows.value.map((item) => //Ugar-biolian
        updateCommentApi(item.id, { category: nextCategory }), //Ugar-biolian
      ), //Ugar-biolian
    ); //Ugar-biolian
    notification.success({ //Ugar-biolian
      message: `已批量更新 ${selectedRows.value.length} 条评论分类`, //Ugar-biolian
    }); //Ugar-biolian
    categoryModalVisible.value = false; //Ugar-biolian
    batchCategory.value = ""; //Ugar-biolian
    await resetSelectionAndReload(); //Ugar-biolian
  } finally { //Ugar-biolian
    batchCategoryLoading.value = false; //Ugar-biolian
  } //Ugar-biolian
} //Ugar-biolian

async function handleViewDetail(record: Recordable) {
  try {
    const res = await getCommentDetailApi(record.id);
    detailRecord.value = res.data;
    detailVisible.value = true;
  } catch {
    notification.error({ message: "获取评论详情失败" });
  }
}

async function handleTogglePin(record: Recordable) {
  try {
    const newStatus = !record.isPinned;
    await updateCommentApi(record.id, { isPinned: newStatus });
    notification.success({ message: newStatus ? "已设为置顶" : "已取消置顶" });
    await reload();
  } catch (error) {
    // 错误处理由 axios 拦截器完成
  }
}

async function handleToggleFeature(record: Recordable) {
  try {
    const newStatus = !record.isFeatured;
    await updateCommentApi(record.id, { isFeatured: newStatus });
    notification.success({ message: newStatus ? "已设为精华" : "已取消精华" });
    await reload();
  } catch (error) {
    // 错误处理由 axios 拦截器完成
  }
}

async function handleDelete(record: Recordable) {
  try {
    await removeCommentApi(record.id);
    notification.success({ message: "评论已删除" });
    await reload();
  } catch (error) {
    // 错误处理由 axios 拦截器完成
  }
}
</script>
