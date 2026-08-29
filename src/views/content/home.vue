<template>
  <PageWrapper title="官网首页配置" content="在这里配置官网首页的核心文案、展示区块与基本参数。">
    <CollapseContainer title="基础配置" class="mb-4">
      <BasicForm @register="registerBasicForm" />
    </CollapseContainer>

    <CollapseContainer title="区块展示开关" class="mb-4">
      <BasicForm @register="registerSwitchForm" />
    </CollapseContainer>
    
    <div class="mb-8 flex flex-wrap justify-center gap-3">
      <Button type="primary" size="large" @click="handleSave" :loading="isSaving">
        保存配置
      </Button>
      <Button size="large" @click="handleReset">
        恢复默认
      </Button>
      <Button size="large" @click="handleExport">
        导出配置
      </Button>
      <Button size="large" @click="importVisible = true">
        导入配置
      </Button>
    </div>

    <Modal
      v-model:open="importVisible"
      title="导入首页配置"
      @ok="handleImport"
      ok-text="导入并覆盖"
    >
      <TextArea
        v-model:value="importText"
        :rows="10"
        placeholder="粘贴导出的 JSON 配置内容"
      />
    </Modal>
  </PageWrapper>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { PageWrapper } from "@/components/Page";
import { CollapseContainer } from "@/components/Container";
import { BasicForm, useForm } from "@/components/Form";
import { Button, Input, Modal } from "ant-design-vue";
import { useMessage } from "@/hooks/web/useMessage";
import {
  defaultHomeContentConfig,
  getHomeContentConfig,
  type HomeContentConfig,
  saveHomeContentConfig,
} from "@/api/sys/content";

const { notification } = useMessage();
const TextArea = Input.TextArea;
const isSaving = ref(false);
const importVisible = ref(false);
const importText = ref("");

const [registerBasicForm, { validate: validateBasic, setFieldsValue: setBasicFields }] =
  useForm({
  labelWidth: 120,
  schemas: [
    {
      field: "heroTitle",
      label: "首页主标题",
      component: "Input",
      required: true,
      defaultValue: defaultHomeContentConfig.heroTitle,
      colProps: { span: 12 },
    },
    {
      field: "heroSubtitle",
      label: "首页副标题",
      component: "Input",
      required: true,
      defaultValue: defaultHomeContentConfig.heroSubtitle,
      colProps: { span: 12 },
    },
    {
      field: "joinLink",
      label: "加入我们链接",
      component: "Input",
      defaultValue: defaultHomeContentConfig.joinLink,
      colProps: { span: 24 },
    },
  ],
  showActionButtonGroup: false,
});

const [
  registerSwitchForm,
  { validate: validateSwitch, setFieldsValue: setSwitchFields },
] = useForm({
  labelWidth: 120,
  schemas: [
    {
      field: "showProject",
      label: "显示项目展厅",
      component: "Switch",
      defaultValue: defaultHomeContentConfig.showProject,
      colProps: { span: 8 },
    },
    {
      field: "showMember",
      label: "显示核心成员",
      component: "Switch",
      defaultValue: defaultHomeContentConfig.showMember,
      colProps: { span: 8 },
    },
    {
      field: "showLanqiao",
      label: "显示蓝桥成就",
      component: "Switch",
      defaultValue: defaultHomeContentConfig.showLanqiao,
      colProps: { span: 8 },
    },
  ],
  showActionButtonGroup: false,
});

onMounted(async () => {
  await applyConfig(getHomeContentConfig());
});

async function handleSave() {
  try {
    isSaving.value = true;
    const basicValues = await validateBasic();
    const switchValues = await validateSwitch();

    saveHomeContentConfig({ ...basicValues, ...switchValues });
    notification.success({ message: "配置保存成功" });
  } finally {
    isSaving.value = false;
  }
}

async function applyConfig(config: HomeContentConfig) {
  await setBasicFields({
    heroTitle: config.heroTitle,
    heroSubtitle: config.heroSubtitle,
    joinLink: config.joinLink,
  });
  await setSwitchFields({
    showProject: config.showProject,
    showMember: config.showMember,
    showLanqiao: config.showLanqiao,
  });
}

async function handleReset() {
  await applyConfig(defaultHomeContentConfig);
  saveHomeContentConfig(defaultHomeContentConfig);
  notification.success({ message: "已恢复默认配置" });
}

async function handleExport() {
  const basicValues = await validateBasic();
  const switchValues = await validateSwitch();
  const config = { ...basicValues, ...switchValues };
  const blob = new Blob([JSON.stringify(config, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "cz-home-config.json";
  link.click();
  URL.revokeObjectURL(url);
}

async function handleImport() {
  try {
    const parsed = JSON.parse(importText.value || "{}");
    const nextConfig = {
      ...defaultHomeContentConfig,
      ...parsed,
    };
    await applyConfig(nextConfig);
    saveHomeContentConfig(nextConfig);
    importVisible.value = false;
    importText.value = "";
    notification.success({ message: "配置导入成功" });
  } catch {
    notification.error({ message: "配置导入失败，请检查 JSON 格式" });
  }
}
</script>
