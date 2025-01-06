<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Model } from "@/types/chat";
import { MoreHorizontal, Trash2, Pencil } from "lucide-vue-next";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ref } from "vue";
defineProps<{
  model: Model;
}>();

defineEmits<{
  (e: "expand"): void;
  (e: "delete", model: Model): void;
}>();
const dialogOpen = ref(false);
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" class="w-8 h-8 p-0">
          <span class="sr-only">Open menu</span>
          <MoreHorizontal class="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem @click="$emit('expand')" class="cursor-pointer">
          <Pencil class="mr-2 h-4 w-4" />
          {{ $t('common.edit') }}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DialogTrigger asChild>
          <DropdownMenuItem class="cursor-pointer text-red-500">
            <Trash2 class="mr-2 h-4 w-4 text-red-500" />
            <span class="text-red-500">{{ $t('common.delete') }} </span>
          </DropdownMenuItem>
        </DialogTrigger>
      </DropdownMenuContent>
    </DropdownMenu>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. Are you sure you want to permanently
          delete this model?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">{{$t('common.cancel')}}</Button>
        </DialogClose>
        <Button @click="$emit('delete', model);dialogOpen=false" variant="destructive">{{$t('common.confirm')}}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
