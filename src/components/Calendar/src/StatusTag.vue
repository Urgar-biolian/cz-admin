<template>
  <Tag :color="statusColor">{{ statusText }}</Tag>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Tag } from "ant-design-vue";

interface Props {
  status: number;
}

const props = defineProps<Props>();

const statusColor = computed(() => {
  switch (props.status) {
    case 0:
      return "blue";
    case 1:
      return "green";
    case 2:
      return "orange";
    default:
      return "default";
  }
});

const statusText = computed(() => {
  switch (props.status) {
    case 0:
      return "未开始";
    case 1:
      return "进行中";
    case 2:
      return "已结束";
    default:
      return "未知";
  }
});
</script>
