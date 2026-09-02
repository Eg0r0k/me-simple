<template>
  <div class="flex flex-col gap-[var(--space-20)] pt-[var(--space-12)]">
    <!-- Ритм задаёт пустое место, а не линии. -->
    <section class="flex flex-col gap-[var(--space-6)]">
      <span class="t-label">Vue · TypeScript · WebGL</span>
      <h1 class="t-display max-w-[16ch]">Интерфейсы без единого бордера</h1>
      <p class="t-body max-w-[52ch] text-muted-foreground">
        Собираю фронтенд, в котором иерархию держат тон и пустота. Пишу на Vue 3 и TypeScript, люблю
        шейдеры и дизайн-системы, которые переживают своих авторов.
      </p>

      <div class="flex flex-wrap items-center gap-[var(--space-3)]">
        <!-- Ровно один primary на экран. -->
        <Button as-child size="lg">
          <Link :to="routeLocation.projects()">
            Смотреть работы
            <Icon name="arrow_forward" />
          </Link>
        </Button>
        <Button as-child variant="ghost" size="lg">
          <Link to="mailto:egokakill@gmail.com">
            <Icon name="mail" />
            Написать
          </Link>
        </Button>
      </div>
    </section>

    <section class="flex flex-col gap-[var(--space-6)]">
      <header class="flex items-baseline gap-[var(--space-3)]">
        <h2 class="t-heading">Избранное</h2>
        <span class="t-hand text-[24px] text-clay">soon more!</span>
        <Link :to="routeLocation.projects()" class="t-label ms-auto no-underline hover:text-fg">
          все проекты
        </Link>
      </header>

      <div class="grid gap-[var(--space-4)] sm:grid-cols-2">
        <Card
          v-for="project in featured"
          :key="project.slug"
          as="article"
          :tone="project.tone"
          :icon="project.icon"
          :title="project.title"
          :caption="project.caption"
          :year="project.year"
        />
        <Card variant="empty" icon="add" title="Следующий" caption="Место под то, что в работе" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Link } from '@/components/ui/link'
import { routeLocation } from '@/router/route-locations'
import { projects } from '@/data/projects'

/* Сетка избранного — карточки; полный список живёт строками (§5.7). */
const featured = projects.slice(0, 3)
</script>
