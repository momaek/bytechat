<template>
  <div class="min-h-[100vh] flex-1 rounded-xl md:min-h-min justify-center flex">
    <Tabs default-value="Appearance" class="w-[700px]">
    <TabsList>
      <TabsTrigger value="Appearance">
       {{ $t('setting.appearance') }}  
      </TabsTrigger>
      <TabsTrigger value="ModelsConfig">
        {{ $t('setting.model_config') }}
      </TabsTrigger>
    </TabsList>
    <TabsContent value="Appearance" class="space-y-6">
      <Appearance />
    </TabsContent>
    <TabsContent value="ModelsConfig" class="space-y-6">
      <Models />
    </TabsContent>
  </Tabs>
  </div>
</template>

<script lang="ts" setup>
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Appearance from './appearance.vue'
import Models from './models.vue'
</script>