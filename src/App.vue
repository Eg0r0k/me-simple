<template>
  <div class="h-screen bg-background flex flex-col">
    <header
      class="flex items-center gap-5 px-4 py-1 text-xs tracking-[0.05em] uppercase font-bold bg-background z-10"
    >
      <Link
        :to="routeLocation.home()"
        exact-active-class="text-foreground"
        inactive-class="text-muted-foreground hover:text-foreground transition-colors"
      >
        home
      </Link>
      <Link
        :to="routeLocation.projects()"
        exact-active-class="text-foreground"
        inactive-class="text-muted-foreground hover:text-foreground transition-colors"
      >
        projects
      </Link>
      <Link
        :to="routeLocation.about()"
        exact-active-class="text-foreground"
        inactive-class="text-muted-foreground hover:text-foreground transition-colors"
      >
        about
      </Link>

      <span class="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon-xs" @click="toggleDark">
          <IconSun v-if="!isDark" class="size-3" />
          <IconMoon v-else class="size-3" />
        </Button>
        <span class="tabular-nums">{{ time }} [GMT+3]</span>
      </span>
    </header>

    <main class="flex-1 min-h-0 relative overflow-hidden">
      <DitherBackground />

      <div class="absolute inset-0 flex flex-col overflow-hidden">
        <div class="flex-1 min-h-0 overflow-y-hidden overflow-x-hidden">
          <RouterView />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useStorage, usePreferredDark } from '@vueuse/core'
import { IconSun, IconMoon } from '@tabler/icons-vue'
import DitherBackground from '@/components/DitherBackground.vue'
import { Link } from '@/components/ui/link'
import { Button } from '@/components/ui/button'
import { routeLocation } from '@/router/route-locations'

const mode = useStorage('theme-mode', 'system')
const prefersDark = usePreferredDark()
const resolvedTheme = computed(() => {
  if (mode.value === 'system') return prefersDark.value ? 'dark' : 'light'
  return mode.value
})
const isDark = computed(() => resolvedTheme.value === 'dark')
watch(
  resolvedTheme,
  (val) => {
    document.documentElement.classList.toggle('dark', val === 'dark')
  },
  { immediate: true },
)
function toggleDark() {
  mode.value = isDark.value ? 'light' : 'dark'
}
const time = ref('')
let timer: ReturnType<typeof setInterval>

function updateTime() {
  const now = new Date()
  time.value = now.toLocaleTimeString('ru-RU', {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => clearInterval(timer))
</script>
