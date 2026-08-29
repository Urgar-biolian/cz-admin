<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
import { ref, computed, unref } from "vue";
import { BasicModal, useModalInner } from "@/components/Modal";
import { BasicForm, useForm } from "@/components/Form/index";
import { formSchema } from "./activity.data";
import { createActivityApi, updateActivityApi } from "@/api/activity";
import { useMessage } from "@/hooks/web/useMessage";
import { getAdminUserOptions } from "@/api/sys/user";

const emit = defineEmits(["success", "register"]);
const isUpdate = ref(true);
const rowId = ref<string>("");
const { notification } = useMessage();

const [
  registerForm,
  { setFieldsValue, resetFields, validate, updateSchema },
] = useForm({
  labelWidth: 100,
  baseColProps: { span: 24 },
  schemas: formSchema,
  showActionButtonGroup: false,
  actionColOptions: { span: 23 },
});

const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  await resetFields();
  setModalProps({ confirmLoading: false });
  isUpdate.value = !!data?.isUpdate;
  const users = await getAdminUserOptions();
  await updateSchema({
    field: "joiners",
    componentProps: {
      mode: "multiple",
      options: users.map((item) => ({
        label: `${item.username} (#${item.userId})`,
        value: String(item.userId),
      })),
    },
  });

  if (unref(isUpdate)) {
    rowId.value = data.record.id;
    await setFieldsValue({
      ...data.record,
      joiners: data.record.joiners
        ? String(data.record.joiners)
            .split(",")
            .map((item: string) => item.trim())
            .filter(Boolean)
        : [],
    });
  }
});

const getTitle = computed(() => (!unref(isUpdate) ? "新增活动" : "编辑活动"));

async function handleSubmit() {
  try {
    const values = await validate();
    setModalProps({ confirmLoading: true });
    const payload = {
      ...values,
      status: Number(values.status),
      joiners: Array.isArray(values.joiners)
        ? values.joiners.join(",")
        : values.joiners || "",
    };
    if (unref(isUpdate)) {
      await updateActivityApi(rowId.value, payload);
      notification.success({ message: `修改成功: ${values.intro}` });
    } else {
      await createActivityApi(payload);
      notification.success({ message: `添加成功: ${values.intro}` });
    }
    closeModal();
    emit("success");
  } finally {
    setModalProps({ confirmLoading: false });
  }
}
</script>
