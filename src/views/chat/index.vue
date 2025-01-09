<template>
  <div v-if="!hasAPIOrModels" class="flex h-screen items-center justify-center">
    <div class="text-center">
      <div class="text-xl font-medium mb-4">未设置 API 或模型</div>
      <router-link
        to="/settings"
        class="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
      >
        前往设置
      </router-link>
    </div>
  </div>
  <div v-else class="flex">
    <div class="flex-1 flex flex-col">
        <div class="flex-1 overflow-auto"></div>
        <ChatInput class="flex-none"></ChatInput>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useModelStore } from "@/stores/model";
import { computed } from "vue";
import ChatInput from "./components/ChatInput.vue";

const modelStore = useModelStore();
const hasAPIOrModels = computed(() => {
  if (modelStore.apis && modelStore.apis.length > 0) {
    // 使用 some 方法替代 forEach
    return modelStore.apis.some((api) => {
      return api.models && api.models.length > 0;
    });
  }
  return false;
});
</script>
