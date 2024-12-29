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
    moveToFirst(index: number) {
      if (index < 0 || index >= this.chats.length) {
        console.error("Index out of bounds");
        return;
      }
      const chat = this.chats.splice(index, 1)[0];
      this.chats.unshift(chat);
    },
    addToFirst(chat: Chat) {
      this.chats.unshift(chat)
    },
  },
})