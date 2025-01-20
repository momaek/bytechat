<template>
<div class="flex flex-col gap-2 w-full max-w-6xl mx-auto">
    <ChatMessage v-for="(msg, idx) in messages" :key="idx" :message="msg" />
</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ChatMessage from './ChatMessage.vue';
import type { ChatMessage as Message } from '@/types/chat';
const props = defineProps<{
    messages?: Message[]
}>()

const messages = computed(() => props.messages)
</script>