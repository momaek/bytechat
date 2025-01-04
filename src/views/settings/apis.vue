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
      <DialogContent
        class="md:max-w-[824px] max-h-[90dvh]"
        @close="apiDialog = false"
      >
        <DialogHeader>
          <DialogTitle>{{ $t("setting.model.new_api_key") }}</DialogTitle>
          <DialogDescription>
            {{ $t("setting.model_config_desc") }}
          </DialogDescription>
        </DialogHeader>
        <form class="grid gap-4 max-h-[50dvh] overflow-auto">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>{{ $t("setting.model.api_key_name") }}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Zenbot"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="provider"
            class="grid grid-cols-4 items-center"
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
          <FormField
            v-slot="{ value }"
            name="models"
            v-if="form.values.models?.length"
          >
            <FormItem>
              <FormLabel>Loaded Models</FormLabel>
              <FormControl>
                <TagsInput
                  :model-value="value"
                  class="max-h-[15dvh] overflow-auto"
                >
                  <TagsInputItem
                    v-for="item in value"
                    :key="item"
                    :value="item"
                  >
                    <TagsInputItemText />
                    <TagsInputItemDelete />
                  </TagsInputItem>

                  <TagsInputInput />
                </TagsInput>
              </FormControl>
              <FormDescription>{{
                $t("setting.model.loaded_models")
              }}</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </form>
        <Separator />
        <DialogFooter class="sm:justify-between">
          <Button variant="outline" @click="apiDialog = false">
            {{ $t("setting.cancel") }}
          </Button>
          <div class="gap-4 flex">
            <Button @click="loadProviderSupportedModels">{{
              $t("setting.model.load_models")
            }}</Button>
            <Button :disabled="!form.values.models">{{
              $t("setting.save")
            }}</Button>
          </div>
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
import type { API, Model } from "@/types/chat";
import { ref } from "vue";
import { getProviderByName, providers } from "@/consts/providers";
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
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from "@/components/ui/tags-input";
import OpenAI from "openai";
import { useModelStore } from "@/stores/model";
import { genRandomeID } from "@/utils/utils";

const newAPIFormSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, "请填写名称"),
    provider: z.string().min(1, "请选择服务商"),
    base: z.string().min(1, "API Base 不能为空"),
    api_key: z.string().min(1, "API Key 不能为空"),
    models: z.array(z.string()).optional(),
  })
);

const form = useForm({
  validationSchema: newAPIFormSchema,
});

const modelStore = useModelStore();

const loadProviderSupportedModels = async () => {
  const { valid } = await form.validate();
  if (!valid) {
    return;
  }
  const { name, provider, base, api_key } = form.values;
  const client = new OpenAI({
    baseURL: base,
    apiKey: api_key,
    dangerouslyAllowBrowser: true,
  });
  const models = await client.models.list();
  form.setFieldValue(
    "models",
    models.data.map((model) => model.id)
  );
  modelStore.addAPI({
    name: name,
    provider: getProviderByName(provider as string),
    base: base,
    key: api_key,
    models: models.data.map(
      (model) =>
        ({
          id: genRandomeID(),
          name: model.id,
          api_base: base,
          api_key: api_key,
        } as Model)
    ),
  } as API);
};

const apiDialog = ref(false);
</script>
