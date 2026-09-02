<template>
  <MotionConfig :reduced-motion="'user'">
    <div class="min-h-screen bg-background">
      <header
        class="mx-auto flex h-[72px] max-w-[880px] items-center gap-[var(--space-6)] px-[var(--space-6)]"
      >
        <Link :to="routeLocation.home()" class="t-subheading shrink-0 no-underline">
          {{ t('common.brand') }}
        </Link>

        <nav class="flex items-center gap-[var(--space-6)]" :aria-label="t('common.sections')">
          <Link
            v-for="item in nav"
            :key="item.key"
            v-slot="{ isExactActive }"
            :to="item.to"
            class="flex flex-col gap-[10px] no-underline"
          >
            <span
              :class="[
                'text-[14.5px]',
                isExactActive ? 'font-semibold text-fg' : 'font-medium text-muted-foreground',
              ]"
              >{{ t(item.key) }}</span
            >
            <span
              :class="['h-[2px] rounded-[2px]', isExactActive ? 'bg-primary' : 'bg-transparent']"
            />
          </Link>
        </nav>

        <span class="ms-auto flex items-center gap-[var(--space-2)]">
          <span class="t-label hidden sm:block">{{ time }} {{ t('common.timezone') }}</span>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon-sm" :aria-label="t('common.language.trigger')">
                <Icon name="translate" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="min-w-[168px]">
              <DropdownMenuLabel>{{ t('common.language.label') }}</DropdownMenuLabel>
              <DropdownMenuItem
                v-for="option in languages"
                :key="option.code"
                @select="setLanguage(option.code)"
              >
                {{ option.code === 'system' ? t('common.language.system') : option.native }}
                <Icon
                  v-if="option.code === language"
                  name="check"
                  :size="16"
                  class="ms-auto text-primary"
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon-sm"
            :aria-label="isDark ? t('common.theme.toLight') : t('common.theme.toDark')"
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
  </MotionConfig>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { MotionConfig } from 'motion-v'
import { Link } from '@/components/ui/link'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { routeLocation } from '@/router/route-locations'
import { useTheme } from '@/composables/useTheme'
import { useLocale } from '@/composables/useLocale'

const { t } = useI18n()
const { isDark, toggleTheme } = useTheme()
const { language, languages, setLanguage, init: initLocale } = useLocale()

const nav = [
  { key: 'nav.work', to: routeLocation.projects() },
  { key: 'nav.about', to: routeLocation.about() },
]

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
  initLocale()
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => clearInterval(timer))
</script>
