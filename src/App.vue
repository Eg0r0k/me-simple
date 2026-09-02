<template>
  <div class="min-h-screen bg-background">
    <header
      class="mx-auto flex h-[72px] max-w-[880px] items-center gap-[var(--space-6)] px-[var(--space-6)]"
    >
      <Link :to="routeLocation.home()" class="t-subheading shrink-0 no-underline">me</Link>

      <!-- §5.5 Tabs, variant line: ни контейнера, ни разделителей. -->
      <nav class="flex items-center gap-[var(--space-6)]" aria-label="Sections">
        <Link
          v-for="item in nav"
          :key="item.label"
          v-slot="{ isExactActive }"
          :to="item.to"
          class="flex flex-col gap-[10px] no-underline"
        >
          <span
            :class="[
              'text-[14.5px]',
              isExactActive ? 'font-semibold text-fg' : 'font-medium text-muted-foreground',
            ]"
            >{{ item.label }}</span
          >
          <span
            :class="['h-[2px] rounded-[2px]', isExactActive ? 'bg-primary' : 'bg-transparent']"
          />
        </Link>
      </nav>

      <span class="ms-auto flex items-center gap-[var(--space-3)]">
        <span class="t-label hidden sm:block">{{ time }} GMT+3</span>
        <Button
          variant="ghost"
          size="icon-sm"
          :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
          @click="toggleTheme"
        >
          <Icon :name="isDark ? 'light_mode' : 'dark_mode'" />
        </Button>
      </span>
    </header>

    <main class="mx-auto max-w-[880px] px-[var(--space-6)] pb-[var(--space-20)]">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useStorage, usePreferredDark } from '@vueuse/core'
import { Link } from '@/components/ui/link'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { routeLocation } from '@/router/route-locations'

const nav = [
  { label: 'work', to: routeLocation.projects() },
  { label: 'about', to: routeLocation.about() },
]

/* §1: тема переключается атрибутом data-theme на корне, не классом. */
const mode = useStorage('theme-mode', 'system')
const prefersDark = usePreferredDark()
const resolvedTheme = computed(() =>
  mode.value === 'system' ? (prefersDark.value ? 'dark' : 'light') : mode.value,
)
const isDark = computed(() => resolvedTheme.value === 'dark')

watch(resolvedTheme, (value) => document.documentElement.setAttribute('data-theme', value), {
  immediate: true,
})

function toggleTheme() {
  mode.value = isDark.value ? 'light' : 'dark'
}

const time = ref('')
let timer: ReturnType<typeof setInterval>

function updateTime() {
  time.value = new Date().toLocaleTimeString('ru-RU', {
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
