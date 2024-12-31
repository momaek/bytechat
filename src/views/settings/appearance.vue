<template>
  <div>
    <h3 class="text-lg font-medium">{{ $t("setting.appearance") }}</h3>
    <p class="text-sm text-muted-foreground">
      Customize the appearance of the app. Automatically switch between day and
      night themes.
    </p>
  </div>
  <Separator />
  <Form class="space-y-8">
    <FormField
      v-slot="{ value }"
      name="language"
      :model-value="currentLanguage"
    >
      <FormItem class="flex flex-col space-y-4">
        <FormLabel>{{ $t("setting.language") }}</FormLabel>
        <Popover v-model:open="open">
          <PopoverTrigger as-child>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                :aria-expanded="open"
                :class="
                  cn(
                    'w-[450px] justify-between',
                    !value && 'text-muted-foreground'
                  )
                "
              >
                {{
                  value
                    ? languages.find((language) => language.value === value)
                        ?.label
                    : $t("setting.select_language")
                }}

                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent class="w-[450px] p-0">
            <Command>
              <CommandInput placeholder="Search language..." />
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    v-for="language in languages"
                    :key="language.value"
                    :value="language.label"
                    @select="
                      () => {
                        currentLanguage = language.value;
                        open = false;
                      }
                    "
                  >
                    <Check
                      :class="
                        cn(
                          'mr-2 h-4 w-4',
                          value === language.value ? 'opacity-100' : 'opacity-0'
                        )
                      "
                    />
                    {{ language.label }}
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <FormDescription>
          This is the language that will be used in the dashboard.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" type="radio" name="theme" :model-value="currentMode">
      <FormItem class="space-y-4">
        <FormLabel>{{ $t("setting.theme") }}</FormLabel>
        <FormDescription> Select the theme for the dashboard. </FormDescription>
        <FormMessage />

        <RadioGroup
          class="grid max-w-md grid-cols-2 gap-8 pt-2"
          v-bind="componentField"
          @update:model-value="(value : string) => currentMode = value"
        >
          <FormItem>
            <FormLabel class="[&:has([data-state=checked])>div]:border-primary">
              <FormControl>
                <RadioGroupItem value="light" class="sr-only" />
              </FormControl>
              <div
                class="items-center rounded-md border-2 border-muted p-1 hover:border-accent"
              >
                <div class="space-y-2 rounded-sm bg-[#ecedef] p-2">
                  <div class="space-y-2 rounded-md bg-white p-2 shadow-sm">
                    <div class="h-2 w-20 rounded-lg bg-[#ecedef]" />
                    <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                  <div
                    class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm"
                  >
                    <div class="h-4 w-4 rounded-full bg-[#ecedef]" />
                    <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                  <div
                    class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm"
                  >
                    <div class="h-4 w-4 rounded-full bg-[#ecedef]" />
                    <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                </div>
              </div>
              <span class="block w-full p-2 text-center font-normal">
                {{ $t("setting.theme.light") }}
              </span>
            </FormLabel>
          </FormItem>
          <FormItem>
            <FormLabel class="[&:has([data-state=checked])>div]:border-primary">
              <FormControl>
                <RadioGroupItem value="dark" class="sr-only" />
              </FormControl>
              <div
                class="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground"
              >
                <div class="space-y-2 rounded-sm bg-slate-950 p-2">
                  <div class="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                    <div class="h-2 w-20 rounded-lg bg-slate-400" />
                    <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                  <div
                    class="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm"
                  >
                    <div class="h-4 w-4 rounded-full bg-slate-400" />
                    <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                  <div
                    class="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm"
                  >
                    <div class="h-4 w-4 rounded-full bg-slate-400" />
                    <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                </div>
              </div>
              <span class="block w-full p-2 text-center font-normal">
                {{ $t("setting.theme.dark") }}
              </span>
            </FormLabel>
          </FormItem>
        </RadioGroup>
      </FormItem>
    </FormField>

    <div class="flex justify-start">
      <Button @click="saveSettings"> {{ $t("setting.save")  }} </Button>
    </div>
  </Form>
</template>
<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Separator from "@/components/ui/separator/Separator.vue";
import { cn } from "@/utils/utils";
import { Check, ChevronsUpDown } from "lucide-vue-next";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useColorMode } from '@vueuse/core'

const mode = useColorMode()
const open = ref(false);
const currentMode = ref<string>(mode.value);


const languages = [
  { label: "English", value: "en" },
  { label: "简体中文", value: "zh" },
] as const;

const { locale } = useI18n();
const currentLanguage = ref(locale.value);
// 在 changeLanguage 函数中保存语言偏好
const changeLanguage = (lang: string) => {
  locale.value = lang;
  localStorage.setItem("locale", lang);
};

const saveSettings = (e: Event) => {
  e.preventDefault();
  changeLanguage(currentLanguage.value);
  mode.value = currentMode.value as 'light' | 'dark' | 'auto';
};
</script>
<style>
.clip-path-diagonal {
  clip-path: polygon(100% 0, 100% 100%, 0 0);
}
</style>
