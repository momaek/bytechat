import { defineStore } from 'pinia'
import type { Chat } from '@/types/chat'

export const useChatStore = defineStore('chat', {
  persist:{
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