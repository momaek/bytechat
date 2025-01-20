<template>
  <div
    class="flex items-start space-x-4"
    :class="{ 'flex-row-reverse space-x-reverse': isUserMessage }"
  >
    <Avatar>
      <AvatarImage :src="avatarSrc" />
      <AvatarFallback>Ohj</AvatarFallback>
    </Avatar>
    <div
      class="relative flex-1 max-w-[80%]"
      @mouseenter="showToolbox = true"
      @mouseleave="showToolbox = false"
    >
      <div
        v-show="showToolbox"
        class="absolute right-0 top-0 -mt-8 flex space-x-2"
      >
        <Button
          variant="ghost"
          size="icon"
          @click="handleCopy"
          :disable="copied"
        >
          <CopyCheck class="h-4 w-4" v-if="copied" />
          <Copy class="h-4 w-4" v-else />
        </Button>
        <Button variant="ghost" size="icon" @click="handleRegenerate">
          <RefreshCwIcon class="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" @click="handleDelete">
          <TrashIcon class="h-4 w-4" />
        </Button>
      </div>
      <div class="rounded-lg bg-muted p-4">
        <template v-if="message.content">
          <MdPreview :id="message.id" :codeFoldable="false" :modelValue="message.content" />
        </template>
        <template v-else>
          <div class="flex items-center space-x-2">
            <div class="h-2 w-2 animate-bounce rounded-full bg-zinc-400"></div>
            <div
              class="h-2 w-2 animate-bounce rounded-full bg-zinc-400"
              style="animation-delay: 0.2s"
            ></div>
            <div
              class="h-2 w-2 animate-bounce rounded-full bg-zinc-400"
              style="animation-delay: 0.4s"
            ></div>
          </div>
        </template>
      </div>
      <p class="text-sm text-muted-foreground/50 mt-2">{{ formatTime(message.created_at) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, CopyCheck, RefreshCwIcon, TrashIcon } from "lucide-vue-next";
// ... existing code ...
import type { ChatMessage } from "@/types/chat";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";
import { computed, ref } from "vue";
import { useClipboard } from "@vueuse/core";
import { formatTime } from "@/utils/utils";

const props = defineProps<{
  message: ChatMessage;
}>();

const message = computed(() => props.message);
const isUserMessage = computed(() => message.value.role === "user");
const showToolbox = ref(false);

const avatarSrc = computed(() =>
  isUserMessage.value ? "/user-avatar.png" : "/ai-avatar.png"
);

const emit = defineEmits(["copy", "regenerate", "delete"]);

const { copy, copied } = useClipboard();

const handleCopy = () => {
  copy(message.value.content);
};

const handleRegenerate = () => {
  emit("regenerate", message.value);
};

const handleDelete = () => {
  emit("delete", message.value);
};
</script>
