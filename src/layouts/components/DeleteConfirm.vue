<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useChatStore } from "@/stores/chat";
import { computed } from "vue";
const props = defineProps<{
  open: boolean;
  chatId: string;
}>();
const emit = defineEmits(["update:open"]);
const open = computed(() => props.open);
const chatStore = useChatStore();

const deleteChat = () => {
  chatStore.deleteChat(props.chatId);
  emit("update:open", false);
};
</script>

<template>
  <AlertDialog v-bind:open="open">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="emit('update:open', false)"
          >Cancel</AlertDialogCancel
        >
        <AlertDialogAction @click="deleteChat">Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
