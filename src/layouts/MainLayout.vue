<script lang="ts">
export const description
  = 'A sidebar that collapses to icons.'
export const iframeHeight = '800px'
export const containerClass = 'w-full h-full'
</script>

<script setup lang=ts>
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronsUpDown,
  Command,
  CreditCard,
  SquarePen,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  Map,
  MoreHorizontal,
  PieChart,
  Settings2,
  Sparkles,
  SquareTerminal,
  Trash2,
  Plus,
  Settings,
  Library,
  Palette,
} from 'lucide-vue-next'

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
}
</script>

<template>
  <div class="aruelayout">
    <div class="drag-area"></div>
    <SidebarProvider>
      <Sidebar collapsible="icon" class="bg-sidebar-primary text-sidebar-primary-foreground">
        <SidebarHeader class="mt-3">
          <SidebarMenu class="space-y-5">
            <SidebarMenuItem>
              <SidebarMenuButton size="lg"
                class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <div
                  class="flex aspect-square size-12 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <img class="rounded-lg" src="../assets/logo.svg" alt="">
                </div>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <h2 class="px-5 text-lg font-medium">ByteChat</h2>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton :tooltip="$t('sidebar.new_chat')"
                class="py-5 outline-1 outline-gray-200 hover:bg-gray-100">
                <Plus />
                <span>{{ $t('sidebar.new_chat') }}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup class="group-data-[collapsible=icon]:hidden">
            <SidebarMenu class=" max-h-96 overflow-y-auto">
              <SidebarMenuItem class="p2-5" v-for="item in data.projects" :key="item.name">
                <SidebarMenuButton class="hover:bg-gray-100 active:bg-gray-100" as-child>
                  <a :href="item.url">
                    <component :is="item.icon" />
                    <span>{{ item.name }}</span>
                  </a>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <SidebarMenuAction show-on-hover>
                      <MoreHorizontal />
                      <span class="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent class="w-48 rounded-lg" side="bottom" align="end">
                    <DropdownMenuItem class="cursor-pointer">
                      <SquarePen class="text-muted-foreground" />
                      <span>{{ $t('sidebar.edit_chat') }}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem class="cursor-pointer">
                      <Trash2 class="text-red-500" />
                      <span class="text-red-500">{{ $t('sidebar.delete_chat') }}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarSeparator class="bg-gray-100" />
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <router-link :to="'/chats'">
                  <SidebarMenuButton :tooltip="$t('sidebar.chats')"
                    class="text-sidebar-foreground/70 hover:bg-gray-100 active:bg-gray-100">
                    <Library class=" text-sidebar-foreground/70" />
                    <span>{{ $t('sidebar.chats') }}</span>
                  </SidebarMenuButton>
                </router-link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <router-link :to="'/draw'">
                  <SidebarMenuButton :tooltip="$t('sidebar.draw')"
                    class="text-sidebar-foreground/70 hover:bg-gray-100 active:bg-gray-100">
                    <Palette class=" text-sidebar-foreground/70" />
                    <span>{{ $t('sidebar.draw') }}</span>
                  </SidebarMenuButton>
                </router-link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <router-link :to="'/settings'">
                  <SidebarMenuButton :tooltip="$t('sidebar.settings')"
                    class="text-sidebar-foreground/70 hover:bg-gray-100 active:bg-gray-100">
                    <Settings class=" text-sidebar-foreground/70" />
                    <span>{{ $t('sidebar.settings') }}</span>
                  </SidebarMenuButton>
                </router-link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <SidebarMenuButton size="lg"
                    class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <Avatar class="h-8 w-8 rounded-lg">
                      <AvatarImage :src="data.user.avatar" :alt="data.user.name" />
                      <AvatarFallback class="rounded-lg">
                        Byte
                      </AvatarFallback>
                    </Avatar>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate font-semibold">HelloByte</span>
                      <span class="truncate text-xs">hello@bytechat.com</span>
                    </div>
                    <ChevronsUpDown class="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side="bottom"
                  align="end" :side-offset="4">
                  <DropdownMenuLabel class="p-0 font-normal">
                    <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar class="h-8 w-8 rounded-lg">
                        <AvatarImage :src="data.user.avatar" :alt="data.user.name" />
                        <AvatarFallback class="rounded-lg">
                          Byte
                        </AvatarFallback>
                      </Avatar>
                      <div class="grid flex-1 text-left text-sm leading-tight">
                        <span class="truncate font-semibold">HelloByte</span>
                        <span class="truncate text-xs">hello@bytechat.com</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Sparkles />
                      {{ $t('sidebar.upgrade_pro') }}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <BadgeCheck />
                      {{ $t('sidebar.account') }}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard />
                      {{ $t('sidebar.billing') }}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell />
                      {{ $t('sidebar.notifications') }}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut />
                    {{ $t('sidebar.logout') }}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header
          class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div class="flex items-center gap-2 px-4">
            <SidebarTrigger class="-ml-1" />
          </div>
        </header>
        <main>
          <RouterView />
        </main>
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>
<style scoped>
.drag-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 20px; /* 拖动区域的高度 */
  -webkit-app-region: drag; /* 启用拖动功能 */
}
</style>