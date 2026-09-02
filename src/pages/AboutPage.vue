<template>
  <div class="flex flex-col gap-[var(--space-8)] pt-[var(--space-12)]">
    <header class="flex flex-col gap-[var(--space-3)]">
      <span class="t-label">Москва · GMT+3</span>
      <h1 class="t-title">О себе</h1>
    </header>

    <div class="grid gap-[var(--space-8)] sm:grid-cols-[1fr_260px]">
      <div class="flex flex-col gap-[var(--space-4)]">
        <p class="t-body text-muted-foreground">
          Фронтенд-разработчик. Делаю быстрые интерфейсы на Vue 3 и TypeScript, а на выходных вожусь
          с WebGL и растровыми эффектами.
        </p>
        <p class="t-body text-muted-foreground">
          Верю, что разделять содержимое лучше пустотой и тоном, чем линиями. Этот сайт собран по
          собственной спецификации, в которой нет ни одного бордера.
        </p>

        <div class="flex flex-wrap gap-[var(--space-2)] pt-[var(--space-2)]">
          <Badge v-for="skill in skills" :key="skill.label" :tone="skill.tone" :icon="skill.icon">
            {{ skill.label }}
          </Badge>
        </div>
      </div>

      <Frame
        ratio="crop"
        radius="alone"
        tone="peri"
        icon="person"
        caption="портрет будет позже"
        note="soon!"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Badge, type BadgeTone } from '@/components/ui/badge'
import { Frame } from '@/components/ui/frame'

const skills: { label: string; tone: BadgeTone; icon: string }[] = [
  { label: 'Vue 3', tone: 'mint', icon: 'code' },
  { label: 'TypeScript', tone: 'sky', icon: 'terminal' },
  { label: 'WebGL', tone: 'peri', icon: 'deployed_code' },
]
</script>
