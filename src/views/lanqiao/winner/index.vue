<template>
  <div class="lanqiao-winner-page">
    <h2>成员成就管理</h2>
    <div class="actions">
      <a-input
        v-model:value="searchTitle"
        placeholder="按成就名称搜索"
        style="width: 200px; margin-right: 8px"
        @press-enter="fetchWinners"
      />
      <a-select
        v-model:value="searchCategory"
        placeholder="按成就类型筛选"
        allow-clear
        style="width: 160px; margin-right: 8px"
        @change="fetchWinners"
      >
        <a-select-option
          v-for="item in categoryOptions"
          :key="item.value"
          :value="item.value"
          >{{ item.label }}</a-select-option
        >
      </a-select>
      <a-select
        v-model:value="searchAward"
        placeholder="按获奖等级筛选"
        allow-clear
        style="width: 150px; margin-right: 8px"
        @change="fetchWinners"
      >
        <a-select-option
          v-for="item in awardOptions"
          :key="item"
          :value="item"
          >{{ item }}</a-select-option
        >
      </a-select>
      <a-button type="primary" @click="showAddModal = true"
        >新增成就</a-button
      >
      <a-button @click="fetchWinners" style="margin-left: 8px"
        >刷新数据</a-button
      >
    </div>

    <a-table
      :dataSource="winners"
      :columns="columns"
      rowKey="id"
      :loading="loading"
      :pagination="{ pageSize: 10, showSizeChanger: true }"
      bordered
      style="margin-top: 16px"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'avatar'">
          <img
            :src="record.avatar"
            alt="avatar"
            style="
              width: 40px;
              height: 40px;
              border-radius: 50%;
              object-fit: cover;
            "
          />
        </template>
        <template v-else-if="column.dataIndex === 'category'">
          <a-tag :color="categoryColor(record.category)">
            {{ categoryLabel(record.category) }}
          </a-tag>
        </template>
        <template v-else-if="column.dataIndex === 'members'">
          <div v-if="record.members?.length" class="flex flex-wrap gap-1">
            <a-tag
              v-for="m in record.members"
              :key="m.user?.userId ?? m.sortOrder"
              color="blue"
              >{{ m.user?.username || "成员" }}</a-tag
            >
          </div>
          <span v-else style="color: #999">未关联</span>
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <a
            :style="index === 0 ? 'color:#c0c4cc;cursor:not-allowed' : ''"
            @click="moveWinner(index, -1)"
            >上移</a
          >
          <a-divider type="vertical" />
          <a
            :style="
              index === winners.length - 1
                ? 'color:#c0c4cc;cursor:not-allowed'
                : ''
            "
            @click="moveWinner(index, 1)"
            >下移</a
          >
          <a-divider type="vertical" />
          <a @click="editWinner(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定删除该成就吗？"
            @confirm="deleteWinner(record.id)"
            ><a>删除</a></a-popconfirm
          >
        </template>
      </template>
    </a-table>

    <!-- 新增/编辑弹窗 -->
    <a-modal
      v-model:open="showAddModal"
      :title="editId ? '编辑成就' : '新增成就'"
      @ok="handleSubmit"
      :confirmLoading="modalLoading"
      @cancel="resetModal"
    >
      <a-form :model="form" layout="vertical">
        <a-form-item label="关联成员（可多选，顺序即展示顺序）" :required="false">
          <a-select
            v-model:value="form.memberIds"
            mode="multiple"
            placeholder="选择关联成员"
            allow-clear
            show-search
            :options="userOptions"
            :field-names="{ label: 'username', value: 'userId' }"
            option-filter-prop="username"
          />
          <div v-if="form.memberIds?.length" class="member-order-list">
            <div
              v-for="(id, index) in form.memberIds"
              :key="id"
              class="member-order-item"
            >
              <span>{{ getUserName(id) }}</span>
              <span class="member-order-actions">
                <a-button
                  size="small"
                  :disabled="index === 0"
                  @click="moveMember(index, -1)"
                  >上移</a-button
                >
                <a-button
                  size="small"
                  :disabled="index === (form.memberIds?.length || 0) - 1"
                  @click="moveMember(index, 1)"
                  >下移</a-button
                >
              </span>
            </div>
          </div>
        </a-form-item>
        <a-form-item label="成就名称" required>
          <a-input
            v-model:value="form.title"
            placeholder="如：蓝桥杯 / 国家奖学金 / 优秀成员"
          />
        </a-form-item>
        <a-form-item label="成就类型" required>
          <a-select v-model:value="form.category" placeholder="请选择成就类型">
            <a-select-option
              v-for="item in categoryOptions"
              :key="item.value"
              :value="item.value"
              >{{ item.label }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="获奖等级" required>
          <a-select v-model:value="form.award" placeholder="请选择获奖等级">
            <a-select-option
              v-for="item in awardOptions"
              :key="item"
              :value="item"
              >{{ item }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="头像">
          <a-upload :beforeUpload="beforeUpload" :showUploadList="false">
            <a-button>上传头像</a-button>
          </a-upload>
          <img
            v-if="form.avatar"
            :src="form.avatar"
            alt="avatar"
            style="
              width: 40px;
              height: 40px;
              border-radius: 50%;
              margin-top: 8px;
            "
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import {
  getWinners,
  createWinner,
  updateWinner,
  deleteWinner as apiDeleteWinner,
  filterWinnersByAward,
  uploadAvatar,
  reorderWinners,
  Winner,
  CreateWinnerDto,
  UpdateWinnerDto,
} from "@/api/lanqiao/winner";
import { getAdminUserOptions } from "@/api/sys/user";

const winners = ref<Winner[]>([]);
const loading = ref(false);
const showAddModal = ref(false);
const modalLoading = ref(false);
const editId = ref<number | null>(null);
const userOptions = ref<Array<{ userId: number; username: string }>>([]);
const form = ref<CreateWinnerDto>({
  title: "",
  award: "",
  category: "COMPETITION",
  avatar: "",
  memberIds: [],
});
const searchTitle = ref("");
const searchAward = ref("");
const searchCategory = ref("");

const categoryOptions = [
  { value: "COMPETITION", label: "学科竞赛" },
  { value: "SCHOLARSHIP", label: "荣誉奖学金" },
  { value: "HONOR", label: "综合荣誉" },
];

const awardOptions = [
  "国一",
  "国二",
  "国三",
  "省一",
  "省二",
  "省三",
  "金奖",
  "银奖",
  "铜奖",
  "特等奖",
  "一等奖",
  "二等奖",
  "三等奖",
  "国家级",
  "省级",
  "校级",
];

const columns = [
  { title: "ID", dataIndex: "id", width: 60 },
  { title: "头像", dataIndex: "avatar", width: 70 },
  { title: "成就名称", dataIndex: "title" },
  { title: "关联成员", dataIndex: "members", width: 200 },
  { title: "成就类型", dataIndex: "category", width: 110 },
  { title: "获奖等级", dataIndex: "award", width: 90 },
  { title: "创建时间", dataIndex: "createdAt", width: 160 },
  { title: "操作", dataIndex: "action", width: 120 },
];

function categoryLabel(category: string) {
  return (
    categoryOptions.find((item) => item.value === category)?.label || category
  );
}

function categoryColor(category: string) {
  if (category === "COMPETITION") return "blue";
  if (category === "SCHOLARSHIP") return "gold";
  if (category === "HONOR") return "green";
  return "default";
}

function getUserName(userId: number) {
  return (
    userOptions.value.find((item) => item.userId === userId)?.username ||
    String(userId)
  );
}

function moveMember(index: number, delta: number) {
  const ids = [...(form.value.memberIds || [])];
  const target = index + delta;
  if (target < 0 || target >= ids.length) return;
  [ids[index], ids[target]] = [ids[target], ids[index]];
  form.value.memberIds = ids;
}

function applyTitleFilter(data: Winner[]) {
  const keyword = searchTitle.value.trim();
  if (!keyword) return data;
  return data.filter((item) => item.title.includes(keyword));
}

async function fetchWinners() {
  loading.value = true;
  try {
    const data = searchAward.value
      ? await filterWinnersByAward(searchAward.value)
      : await getWinners();
    let list = applyTitleFilter(data);
    if (searchCategory.value) {
      list = list.filter((item) => item.category === searchCategory.value);
    }
    winners.value = list;
  } catch (error) {
    message.error(
      "获取成就列表失败: " + ((error as Error).message || "未知错误"),
    );
  } finally {
    loading.value = false;
  }
}

function resetModal() {
  showAddModal.value = false;
  modalLoading.value = false;
  editId.value = null;
  form.value = {
    title: "",
    award: "",
    category: "COMPETITION",
    avatar: "",
    memberIds: [],
  };
}

function handleSubmit() {
  if (!form.value.title || !form.value.award) {
    message.error("请填写完整信息");
    return;
  }

  modalLoading.value = true;

  const submit = editId.value
    ? updateWinner(editId.value, form.value as UpdateWinnerDto)
    : createWinner(form.value as CreateWinnerDto);

  submit
    .then(() => {
      message.success(editId.value ? "编辑成功" : "新增成功");
      fetchWinners();
      resetModal();
    })
    .catch((error) => {
      message.error(
        editId.value
          ? "编辑失败"
          : "新增失败: " + (error.message || "未知错误"),
      );
    })
    .finally(() => (modalLoading.value = false));
}

function editWinner(record: Winner) {
  editId.value = record.id;
  form.value = {
    title: record.title,
    award: record.award,
    category: record.category || "COMPETITION",
    avatar: record.avatar,
    memberIds:
      record.members
        ?.map((m) => m.user?.userId)
        .filter((id): id is number => Boolean(id)) || [],
  };
  showAddModal.value = true;
}

function deleteWinner(id: number) {
  apiDeleteWinner(id)
    .then(() => {
      message.success("删除成功");
      fetchWinners();
    })
    .catch((error) => {
      message.error("删除失败: " + (error.message || "未知错误"));
    });
}

async function moveWinner(index: number, delta: number) {
  const target = index + delta;
  if (target < 0 || target >= winners.value.length) return;

  const list = [...winners.value];
  [list[index], list[target]] = [list[target], list[index]];
  winners.value = list;

  try {
    await reorderWinners(winners.value.map((w) => w.id));
    message.success("展示顺序已更新");
  } catch (error) {
    message.error("排序更新失败: " + (error.message || "未知错误"));
    fetchWinners();
  }
}

async function beforeUpload(file: File) {
  try {
    const res = await uploadAvatar(file);
    form.value.avatar = res.url;
    message.success("头像上传成功");
  } catch (error) {
    message.error("头像上传失败: " + (error.message || "未知错误"));
  }
  return false;
}

onMounted(async () => {
  fetchWinners();
  try {
    userOptions.value = await getAdminUserOptions();
  } catch (error) {
    console.error("获取成员选项失败:", error);
  }
});
</script>

<style scoped>
.lanqiao-winner-page {
  padding: 24px;
}
.actions {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.member-order-list {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.member-order-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border: 1px solid #e5e6eb;
  border-radius: 6px;
  background: #fafafa;
}
.member-order-actions {
  display: flex;
  gap: 6px;
}
</style>
