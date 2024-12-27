<script setup lang="ts">
import { RouterView } from 'vue-router'
import SidebarProvider from '@/components/ui/sidebar/SidebarProvider'

// 这里可以添加导航项配置
const navigationItems = [
  {
    title: '首页',
    href: '/',
    icon: 'home'
  },
  {
    title: '登录',
    href: '/login',
    icon: 'log-in'
  }
]
</script>

<template>
  <div class="layout">
    <SidebarProvider>
      <Sidebar>
        <!-- 导航内容 -->
        <div class="flex flex-col space-y-4 p-4">
          <a 
            v-for="item in navigationItems" 
            :key="item.href"
            :href="item.href"
            class="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
          >
            <component :is="item.icon" class="h-4 w-4" />
            <span>{{ item.title }}</span>
          </a>
        </div>
        
        <!-- 主要内容区域 -->
        <RouterView />
      </Sidebar>
    </SidebarProvider>
  </div>
</template>
