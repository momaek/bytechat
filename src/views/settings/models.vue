<template>
  <div>
    <h3 class="text-lg font-medium mb-2">{{ $t("setting.model_config") }}</h3>
    <p class="text-sm text-muted-foreground">
      {{ $t("setting.model_config_desc") }}
    </p>

    <div class="mt-4">
      <Button @click="apiDialog = true">
        <Plus /> {{ $t("setting.model.new_api_key") }}
      </Button>
    </div>

    <Dialog v-bind:open="apiDialog">
      <DialogContent class="md:max-w-[824px]" @close="apiDialog = false">
        <DialogHeader>
          <DialogTitle>{{ $t("setting.model.new_api_key") }}</DialogTitle>
          <DialogDescription>
            {{ $t("setting.model_config_desc") }}
          </DialogDescription>
        </DialogHeader>
        <form class="grid gap-4 py-4">
          <FormField
            v-slot="{ componentField }"
            name="provider"
            class="grid grid-cols-4 items-center gap-4"
          >
            <FormItem>
              <FormLabel>Provider</FormLabel>
              <Select v-bind:="componentField">
                <FormControl>
                  <SelectTrigger class="col-span-3">
                    <SelectValue placeholder="OpenAI" />
                  </SelectTrigger>
                </FormControl>
                <FormDescription />
                <FormMessage />
                <SelectContent>
                  <SelectItem v-for="p in providers" :value="p.name">
                    <span class="flex items-center"
                      ><component :is="p.icon" class="w-4 mr-2" />
                      {{ p.name }}</span
                    >
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="api_key"
            class="grid grid-cols-4 items-center gap-4"
          >
            <FormItem>
              <FormLabel>
                {{ $t("setting.model.api_key") }}
              </FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  :placeholder="$t('setting.model.api_key_placeholder')"
                  class="col-span-3"
                />
              </FormControl>
              <FormDescription> </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="base"
            class="grid grid-cols-4 items-center gap-4"
          >
            <FormItem>
              <FormLabel>
                {{ $t("setting.model.api_base") }}
              </FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  :placeholder="$t('setting.model.api_base_placeholder')"
                  class="col-span-3"
                />
              </FormControl>
              <FormDescription>
                {{ $t("setting.model.api_base_recommend") }}
                <a
                  href="https://one.zenbot.me"
                  class="underline text-primary/50 hover:text-primary/80"
                  target="_blank"
                >
                  https://one.zenbot.me</a
                >
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </form>
        <DialogFooter>
          <Button @click="loadProviderSupportedModels"> Load Models</Button>
          <Button> Save changes </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
  <Separator />
</template>
<script setup lang="ts">
import { Separator } from "@/components/ui/separator";
import Button from "@/components/ui/button/Button.vue";
// import { useModelStore } from "@/stores/model";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { API } from "@/types/chat";
import { ref } from "vue";
import { providers } from "@/consts/providers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const newAPIFormSchema = toTypedSchema(
  z.object({
    provider: z
      .string({
        required_error: "请选择服务商",
      })
      .min(1, "请选择服务商"),
    base: z
      .string({
        required_error: "API Base 不能为空",
      })
      .min(1, "API Base 不能为空"),
    api_key: z
      .string({
        required_error: "API Key 不能为空",
      })
      .min(1, "API Key 不能为空"),
    models: z.array(z.string()).optional(),
  })
);

const form = useForm({
  validationSchema: newAPIFormSchema,
});

const loadProviderSupportedModels = async () => {
  const { valid } = await form.validate();
  if (!valid) {
    return;
  }
  const { provider, base, api_key } = form.values;
  console.log("Current form values:", { provider, base, api_key });
};

// const modelStore = useModelStore();
const apiDialog = ref(false);
</script>
