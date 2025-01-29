<template>
  <div
    class="flex flex-col h-screen max-h-[calc(100dvh-5rem)] overscroll-contain"
  >
    <ChatMessages
      class="flex-1 h-full overflow-auto mb-6 overscroll-contain"
      :messages="currentChat?.messages"
      @delete="deleteMessage"
    />
    <div class="flex-none border-t bg-background">
      <ChatInput
        v-model:generating="generating"
        @send="sendMessage"
        @stop="stopGenerate"
        @clear="clearContext"
        @toggle-model="toggleModel"
        @toggle-setting="toggleSetting"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatInputData } from "@/types/openai";
import ChatInput from "./components/ChatInput.vue";
import { computed, ref } from "vue";
import { useChatStore } from "@/stores/chat";
import { useRoute } from "vue-router";
import { streamText, type CoreMessage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import type { ChatMessage } from "@/types/chat";
import ChatMessages from "./components/ChatMessages.vue";
import { genRandomeID } from "@/utils/utils";

const generating = ref(false);
const chatStore = useChatStore();
const route = useRoute();

// 获取当前聊天记录
const currentChat = computed(() => {
  const chatId = route.params.chat_id as string;
  return chatStore.chats.find((chat) => chat.id === chatId);
});

const deleteMessage = (msg: ChatMessage) => {
  if (currentChat.value) {
    chatStore.deleteMessage(currentChat.value.id, msg.id);
  }
};

const formatMessage = (msg: ChatMessage) => {
  if (msg.images && msg.images.length > 0) {
    return {
      role: msg.role,
      content: [
        { type: "text", text: msg.content },
        ...msg.images.map((image) => ({ type: "image", image })),
      ],
    };
  }
  return {
    role: msg.role,
    content: msg.content,
  };
};

const generateTitle = async (
  userMessage: string,
  aiResponse: string,
  openai: any
) => {
  try {
    const titleResp = await streamText({
      model: openai.chat("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content:
            "请基于用户的问题和AI的回答，生成一个简短的对话标题（不超过10个字符）。只需要返回标题文本，不需要任何其他内容。",
        },
        {
          role: "user",
          content: `用户问题：${userMessage}\nAI回答：${aiResponse}`,
        },
      ] as CoreMessage[],
    });

    let title = "";
    for await (const textPart of titleResp.textStream) {
      title += textPart;
    }

    // 更新聊天标题
    if (currentChat.value) {
      chatStore.updateChatTitle(currentChat.value.id, title.trim());
    }
  } catch (error) {
    console.error("Error generating title:", error);
  }
};

const sendMessage = async (data: ChatInputData) => {
  const openai = createOpenAI({
    apiKey: currentChat.value?.model.api_key,
    baseURL: currentChat.value?.model.api_base,
  });

  if (!currentChat.value) {
    console.error("No chat selected");
    return;
  }

  // 创建用户消息
  const userMessage: ChatMessage = {
    id: genRandomeID(), // 生成唯一ID
    role: "user",
    content: data.text,
    images: data.images,
    created_at: new Date().toISOString(),
  };

  chatStore.appendOrUpdateMessage(currentChat.value, userMessage);

  // 获取最近6条消息并格式化
  const recentMessages = [
    ...(currentChat.value.messages || []).slice(-6),
    userMessage,
  ].map(formatMessage);

  // 创建 AI 响应消息
  const assistantMessage: ChatMessage = {
    id: genRandomeID(),
    role: "assistant",
    content: "",
    created_at: new Date().toISOString(),
  };

  // 先添加一个空的助手消息
  chatStore.appendOrUpdateMessage(currentChat.value, assistantMessage);

  generating.value = true;
  try {
    const resp = streamText({
      model: openai.chat(currentChat.value.model.name || "gpt-3.5-turbo"),
      messages: recentMessages as CoreMessage[],
    });

    // 用于累积流式响应的文本
    let accumulatedText = "";

    for await (const textPart of resp.textStream) {
      accumulatedText += textPart;
      // 更新助手消息的内容
      chatStore.appendOrUpdateMessage(currentChat.value, {
        ...assistantMessage,
        content: accumulatedText,
      });
    }

    // AI 响应完成后，如果是第一轮对话，异步生成标题
    if (currentChat.value?.messages && currentChat.value.messages.length == 2) {
      generateTitle(data.text, accumulatedText, openai);
    }
  } catch (error) {
    console.error("Error during message streaming:", error);
  } finally {
    generating.value = false;
  }
};

const stopGenerate = () => {
  generating.value = false;
};

const clearContext = () => {
  generating.value = false;
};

const toggleSetting = () => {};

const toggleModel = () => {};
</script>
