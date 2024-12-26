<script setup lang="ts">
import { RouterView } from 'vue-router'
import {
  SidebarHeader,
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarMenuButton,

} from '@/components/ui/sidebar'


</script>

<template>
  <div class="layout">
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                Select Workspace
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <!-- 主要内容区域 -->
        <RouterView />
      </Sidebar>
    </SidebarProvider>
  </div>
</template>
