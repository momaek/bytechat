<template>
  <div
    class="flex flex-col gap-2 w-full max-w-6xl mx-auto"
    ref="chatMessagesRef"
  >
    <ChatMessage v-for="(msg, idx) in messages" :key="idx" :message="msg" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import ChatMessage from "./ChatMessage.vue";
import type { ChatMessage as Message } from "@/types/chat";
const props = defineProps<{
  messages?: Message[];
}>();

const messages = computed(() => props.messages);

// Reference to ChatMessages component
const chatMessagesRef = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (chatMessagesRef.value) {
      const element = chatMessagesRef.value;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    }
  });
};

// Watch for changes in messages and scroll to bottom
watch(
  () => props.messages,
  () => {
    scrollToBottom();
  },
  { deep: true, immediate: true }
);
</script>
