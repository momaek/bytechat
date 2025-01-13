<template>
    <div class="flex flex-col ">
        <div class="messages flex-1 overflow-auto"></div>
        <ChatInput class="flex-none" />
    </div>
</template>
<script setup lang="ts">
import ChatInput from './components/ChatInput.vue';
</script>