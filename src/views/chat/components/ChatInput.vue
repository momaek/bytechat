<template>
  <div class=" bottom-0 left-0 right-0 p-4">
    <div class="max-w-6xl mx-auto rounded-lg">
      <!-- 图片预览区域 -->
      <div v-if="images.length > 0" class="mb-2 flex flex-wrap gap-2">
        <div
          v-for="(image, idx) in images"
          class="relative group border rounded-md"
        >
          <button
            class="absolute top-[-4px] right-[-4px] p-1 bg-primary/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            @click="removeImage(idx)"
          >
            <XIcon class="w-4 h-4 text-primary-foreground" />
          </button>
          <img :src="image" alt="" class="w-14 h-14 rounded-md" />
        </div>
      </div>

      <div class="flex flex-col relative rounded-lg border">
        <div
          v-if="isGenerating"
          class="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg"
        >
          <Button variant="destructive" @click="stopGenerating">
            <XIcon class="h-4 w-4 mr-2" />
            停止生成
          </Button>
        </div>
        <textarea
          v-model="message"
          ref="textareaRef"
          rows="2"
          class="w-full resize-none px-3 pt-2 pb-10 text-md max-h-[20dvh] bg-transparent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="输入消息..."
          @input="adjustHeight"
          @keydown.enter="handleKeyDown"
        />

        <!-- 工具栏 -->
        <div class="flex items-center rounded-md justify-between p-1">
          <div class="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  class="hover:bg-muted hover:text-primary transition-colors"
                  @click="triggerImageUpload"
                >
                  <ImageIcon class="h-4 w-4" />
                  <input
                    ref="fileInput"
                    type="file"
                    class="hidden"
                    accept="image/*"
                    multiple
                    @change="handleImageChange"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>上传图片</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  class="hover:bg-muted hover:text-primary transition-colors"
                  @click="clearContext"
                >
                  <Paintbrush class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>清理当前所有上下文</TooltipContent>
            </Tooltip>

            <!-- <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  class="hover:bg-muted hover:text-primary transition-colors"
                >
                  <Share2Icon class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>分享</TooltipContent>
            </Tooltip> -->

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  class="hover:bg-muted hover:text-primary transition-colors"
                  @click="toggleModel"
                >
                  <LayoutTemplateIcon class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>模型切换</TooltipContent>
            </Tooltip>

            <!-- <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  class="hover:bg-muted hover:text-primary transition-colors"
                >
                  <RefreshCwIcon class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>重新生成</TooltipContent>
            </Tooltip> -->

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  class="hover:bg-muted hover:text-primary transition-colors"
                  @click="toggleSetting"
                >
                  <AlignJustifyIcon class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>设置</TooltipContent>
            </Tooltip>
          </div>

          <Button
            :disabled="!message.trim() && images.length === 0"
            @click="handleSend"
            class="ml-2 w-20"
          >
            <SendIcon class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, nextTick, computed } from "vue";
import { Button } from "@/components/ui/button";
import {
  ImageIcon,
  SendIcon,
  XIcon,
  LayoutTemplateIcon,
  AlignJustifyIcon,
  Paintbrush,
} from "lucide-vue-next";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ChatInputData } from "@/types/openai";

const props = defineProps({
  generating: {
    type: Boolean,
    default: false,
  },
});

const message = ref("");
const images = ref<string[]>([]);
const textareaRef = ref<HTMLTextAreaElement>();
const fileInput = ref<HTMLInputElement>();
const isGenerating = computed(() => props.generating);

const emit = defineEmits<{
  send: [data: ChatInputData];
  stop: [];
  clear: [];
  toggleModel: [];
  toggleSetting: [];
}>();
const handleKeyDown = (e: KeyboardEvent) => {
  // 如果按下了 shift 键，不阻止默认行为（允许换行）
  if (e.shiftKey || e.isComposing || e.keyCode === 229) {
    return;
  }
  // 否则阻止默认行为并发送消息
  e.preventDefault();
  handleSend();
};

const stopGenerating = () => {
  emit("stop");
};

const adjustHeight = () => {
  const textarea = textareaRef.value;
  if (!textarea) return;

  // 确保 DOM 已经更新
  nextTick(() => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  });
};

const triggerImageUpload = () => {
  fileInput.value?.click();
};

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const handleImageChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files || []);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      console.log("error");
      continue;
    }

    try {
      const base64 = await convertToBase64(file);
      images.value.push(base64);
    } catch (error) {
      console.log("err", error);
    }
  }

  input.value = "";
};

const removeImage = (index: number) => {
  images.value.splice(index, 1);
};

const clearContext = () => {
  message.value = "";
  images.value = [];
  emit("clear");
};

const toggleModel = () => {
  emit("toggleModel");
};

const toggleSetting = () => {
  emit("toggleSetting");
};

const handleSend = () => {
  if (!message.value.trim() && images.value.length === 0) return;

  emit("send", {
    text: message.value,
    images: images.value,
  });

  message.value = "";
  images.value = [];

  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";
  }
};

onMounted(() => {
  nextTick(() => {
    adjustHeight();
  });
});
</script>
