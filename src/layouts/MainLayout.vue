<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="layout">
    <header>
      <!-- 头部导航栏等 -->
    </header>
    
    <main>
      <RouterView />
    </main>
    
    <footer>
      <!-- 页脚内容 -->
    </footer>
  </div>
</template>