<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="生成邀请码" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
import { BasicModal, useModalInner } from "@/components/Modal";
import { BasicForm, useForm } from "@/components/Form/index";
import { formSchema } from "./invitation.data";
import { generateInvitationApi } from "@/api/sys/invitation";
import { useMessage } from "@/hooks/web/useMessage";

const emit = defineEmits(["success", "register"]);
const { notification } = useMessage();

const [registerForm, { resetFields, validate }] = useForm({
  labelWidth: 100,
  baseColProps: { span: 24 },
  schemas: formSchema,
  showActionButtonGroup: false,
  actionColOptions: { span: 23 },
});

const [registerModal, { setModalProps, closeModal }] = useModalInner(() => {
  resetFields();
  setModalProps({ confirmLoading: false });
});

async function handleSubmit() {
  try {
    const values = await validate();
    setModalProps({ confirmLoading: true });
    const result = await generateInvitationApi(values);
    notification.success({ message: `邀请码 ${result.code} 生成成功` });
    closeModal();
    emit("success");
  } finally {
    setModalProps({ confirmLoading: false });
  }
}
</script>
