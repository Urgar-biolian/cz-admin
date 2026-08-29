<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
import { ref, computed, unref } from "vue";
import { BasicModal, useModalInner } from "@/components/Modal";
import { BasicForm, useForm } from "@/components/Form/index";
import { formSchema } from "./message.data";
import { createMsgApi, updateMsgApi } from "@/api/sys/message";
import { useMessage } from "@/hooks/web/useMessage";

const emit = defineEmits(["success", "register"]);
const isUpdate = ref(true);
const rowId = ref<number>(0);
const { notification } = useMessage();

const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
  labelWidth: 80,
  baseColProps: { span: 24 },
  schemas: formSchema,
  showActionButtonGroup: false,
  actionColOptions: { span: 23 },
});

const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  resetFields();
  setModalProps({ confirmLoading: false });
  isUpdate.value = !!data?.isUpdate;

  if (unref(isUpdate)) {
    rowId.value = data.record.id;
    setFieldsValue({
      ...data.record,
    });
  }
});

const getTitle = computed(() => (!unref(isUpdate) ? "新增通知" : "编辑通知"));

async function handleSubmit() {
  try {
    const values = await validate();
    setModalProps({ confirmLoading: true });
    if (unref(isUpdate)) {
      await updateMsgApi(rowId.value, values);
      notification.success({ message: `修改成功: ${values.title}` });
    } else {
      await createMsgApi(values);
      notification.success({ message: `添加成功: ${values.title}` });
    }
    closeModal();
    emit("success");
  } finally {
    setModalProps({ confirmLoading: false });
  }
}
</script>
