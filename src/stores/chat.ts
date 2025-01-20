import { defineStore } from 'pinia'
import type { Chat, ChatMessage } from '@/types/chat'

export const useChatStore = defineStore('chat', {
  persist: {
    key: "chats",
    storage: localStorage
  },
  state: () => ({
    chats: [] as Chat[],
  }),
  actions: {
    addChat(chat: Chat) {
      this.chats.push(chat)
    },
    // ... existing code ...
    appendOrUpdateMessage(chat: Chat, message: ChatMessage) {
      const chatIndex = this.chats.findIndex(c => c.id === chat.id);
      if (chatIndex === -1) {
        console.error("Chat not found");
        return;
      }

      // 确保 messages 数组存在
      if (!this.chats[chatIndex].messages) {
        this.chats[chatIndex].messages = [] as ChatMessage[];
      }

      const messageIndex = this.chats[chatIndex].messages.findIndex(m => m.id === message.id);
      if (messageIndex === -1) {
        this.chats[chatIndex].messages.push(message);
      } else {
        // 使用数组的方式更新消息，以确保响应式更新
        this.chats[chatIndex].messages[messageIndex] = message;
      }
    },
    
    deleteChat(chatId: string) {
      const index = this.chats.findIndex(chat => chat.id === chatId);
      if (index !== -1) {
        this.chats.splice(index, 1);
      }
    },

    updateChatTitle(chatId: string, title: string) {
      const chat = this.chats.find(chat => chat.id === chatId);
      if (chat) {
        chat.title = title;
      }
    },
    // ... existing code ...
    moveToFirst(chat: Chat) {
      const index = this.chats.findIndex(c => c.id === chat.id);
      if (index === -1) {
        console.error("Chat not found");
        return;
      }
      this.chats.splice(index, 1);
      this.chats.unshift(chat);
    },
    addToFirst(chat: Chat) {
      this.chats.unshift(chat)
    },
  },
})