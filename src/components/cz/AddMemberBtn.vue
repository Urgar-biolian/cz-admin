<template>
  <Avatar
    :src="DefaultAdd"
    @click="handleClick"
    class="ml-2 cursor-pointer border-1 border-solid border-gray-300 w-[2rem] h-[2rem] contrast-150 hover:scale-105 transition-all animate-ease-in-out"
  />
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getUserInfoById } from "@/api/sys/user";
import { Avatar } from "ant-design-vue";
import showUserModal from "./UserModal";
import DefaultAdd from "@/assets/icons/add.png";

defineOptions({ name: "AddMemberBtn" });

const props = defineProps<{ filterId: string[] }>();

function handleClick() {
  console.log(1);
}

onMounted(async () => {});
</script>
<style lang="less"></style>
