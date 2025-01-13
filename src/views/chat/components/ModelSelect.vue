<template>
  <Toaster />
  <div class="flex-1 max-w-2xl m-auto overflow-auto">
    <Card class="w-full max-h-[50dvh] overflow-auto">
      <CardHeader>
        <CardTitle>Create Chat</CardTitle>
        <CardDescription>Create a chat in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label>Model</Label>
              <Popover id="name" v-model:open="open">
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    role="combobox"
                    :aria-expanded="open"
                    class="w-full justify-between"
                  >
                    {{
                      chat.model?.id
                        ? findModelName(chat.model.id)
                        : "Select Model..."
                    }}
                    <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-[--radix-popover-trigger-width] p-0">
                  <Command class="">
                    <CommandInput
                      class="h-9"
                      placeholder="Search framework..."
                    />
                    <CommandEmpty>未找到相关模型</CommandEmpty>
                    <CommandList>
                      <CommandGroup
                        v-for="api in apis"
                        :key="api.name"
                        :heading="api.name"
                      >
                        <CommandItem
                          v-for="model in api.models"
                          :key="model.id"
                          :value="model.name"
                          @select="
                            (ev) => {
                              if (typeof ev.detail.value === 'string') {
                                const selectedApi = apis.find((api) =>
                                  api.models?.some(
                                    (model) => model.name === ev.detail.value
                                  )
                                );
                                const selectedModel = selectedApi?.models?.find(
                                  (model) => model.name === ev.detail.value
                                );
                                if (selectedModel) {
                                  chat.model = selectedModel;
                                }
                              }
                              open = false;
                            }
                          "
                        >
                          <div class="flex flex-col">
                            <span>{{ model.name }}</span>
                            <span class="text-xs text-muted-foreground">{{
                              model.description
                            }}</span>
                          </div>
                          <Check
                            :class="
                              cn(
                                'ml-auto h-4 w-4',
                                chat.model?.name === model.name
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )
                            "
                          />
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="prompt">Prompt or Select Bot?</Label>
              <Textarea
                id="prompt"
                v-model="chat.prompt"
                placeholder="Enter a prompt"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex justify-end px-6 pb-6">
        <Button @click="createChat">Create</Button>
      </CardFooter>
    </Card>
  </div>
</template>
<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-vue-next";
import { computed, ref } from "vue";
import type { Chat } from "@/types/chat";
import { cn, genRandomeID } from "@/utils/utils";
import { useModelStore } from "@/stores/model";
import Toaster from "@/components/ui/toast/Toaster.vue";
import { useToast } from "@/components/ui/toast/use-toast";
import { useChatStore } from "@/stores/chat";

const open = ref(false);
const chatStore = useChatStore();
const chat = ref<Chat>({} as Chat);
const modelStore = useModelStore();
const apis = computed(() => modelStore.apis);
const findModelName = (modelId: string) => {
  for (const api of apis.value) {
    const model = api.models?.find((m) => m.id === modelId);
    if (model) {
      return model.name;
    }
  }
  return "";
};

const { toast } = useToast();
const createChat = () => {
  if (!chat.value.model) {
    toast({
      title: "Error",
      description: "Please select a model",
      variant: "destructive",
    });
    return;
  }

  chat.value.id = genRandomeID();
  chat.value.created_at = new Date();

  chatStore.addToFirst(chat.value);
  chat.value = {} as Chat;
};
</script>
