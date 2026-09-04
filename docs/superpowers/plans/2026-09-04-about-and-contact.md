# Описание и контакты: план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Верхний блок главной получает чипы стека с логотипами, всплывающие карточки на словах о Москве, удалёнке и предложениях, третий абзац и список достижений; секция «Связь» получает крупную копируемую почту, кнопку «Написать» и квадратные иконки с подсказками. «Опыт» не меняется.

**Architecture:** Маленькие компоненты в `src/components/home/` (`TechChip`, `HoverNote`, `AwardRow`, `CopyEmail`) и два UI-обёрточных набора над reka-ui (`hover-card`, `tooltip`) по образцу `dropdown-menu`. Данные стека и достижений в `src/data/`. Часы выносятся в `useMoscowTime` и используются шапкой и карточкой «Москве». `HomePage.vue` собирает всё это.

**Tech Stack:** Vue 3.5 `<script setup>` + TypeScript, reka-ui 2 (`HoverCard*`, `Tooltip*`), vue-i18n 11 (`I18nT`), `unplugin-icons` + `@iconify-json/logos` (новая dev-зависимость), Tailwind 4 с токенами `src/style.css`, `tw-animate-css`, vitest + jsdom + `@vue/test-utils`, pnpm.

Спек: `docs/superpowers/specs/2026-09-04-about-and-contact-design.md`.

## Global Constraints

- Пакетный менеджер `pnpm`: `pnpm test:run`, `pnpm type-check`, `pnpm lint`, `pnpm build`.
- Никаких `border`; подчёркивания только через `text-decoration`. Тени только `shadow-2`. `transition` только по `opacity`, `color`, `background-color`, `transform`, `scale`, `text-decoration-color`; никакого `transition-all`.
- `press-scale` у всего нажимаемого. Ховер только под `hover: hover` (Tailwind `hover:`). Под reduced motion появления без сдвига (`motion-reduce:`).
- Иконки Material Symbols rounded через `~icons/material-symbols/<name>-rounded`; логотипы стека через `~icons/logos/<name>` — единственное исключение.
- Комментарии на русском, только где нужно «почему». Сообщения коммитов на английском в стиле `git log`.
- `noUncheckedIndexedAccess` включён.
- Стейджить только файлы задачи; никогда `git add -A`. Коммит после каждой задачи.
- Существующие токены: `--raised`/`bg-raised`, `--shadow-2`/`shadow-2`, `--radius-2/3/4`/`rounded-2/3/4`, `--radius-xs`/`rounded-xs`, `--dur-hover/surface/press`, `--ease-standard`/`ease-standard`, `--primary`/`text-primary`, `--mint`/`bg-mint`, `--faint`/`text-faint`, `t-hand`, `t-small`, `t-code`. `@keyframes ds-breathe` есть в `src/style.css`; класса `.ds-breathe` может не быть — проверить `grep -n "ds-breathe" src/style.css` и при отсутствии добавить в `@layer components`: `.ds-breathe { animation: ds-breathe 2.4s ease-in-out infinite; }` плюс `@media (prefers-reduced-motion: reduce) { .ds-breathe { animation: none; } }`.

## Карта файлов

| Файл | Ответственность |
|---|---|
| `package.json` | + `@iconify-json/logos` |
| `src/data/stack.ts`, `src/data/awards.ts` | Данные чипов и достижений |
| `src/composables/useMoscowTime.ts` (+spec) | Московское время для шапки и карточки |
| `src/components/ui/hover-card/*`, `src/components/ui/tooltip/*` | Обёртки reka-ui со стилями системы |
| `src/components/home/TechChip.vue`, `HoverNote.vue`, `AwardRow.vue`, `CopyEmail.vue` (+spec) | Элементы главной |
| `src/components/AppHeader.vue` | Часы через `useMoscowTime` |
| `src/app/i18n/locales/{ru,en}/{home,contact,awards}.json`, `index.ts` | Тексты |
| `src/pages/HomePage.vue` | Сборка верхнего блока и контактов |

---

### Task 1: Логотипы стека у роли

**Files:**
- Modify: `package.json` (через `pnpm add -D @iconify-json/logos`)
- Create: `src/data/stack.ts`, `src/data/stack.spec.ts`, `src/components/home/TechChip.vue`
- Modify: `src/pages/HomePage.vue`

- [ ] **Step 1: Поставить набор логотипов и проверить имена**

Run: `pnpm add -D @iconify-json/logos` и затем
```bash
node -e "const j=require('@iconify-json/logos/icons.json');console.log(['vue','nuxt-icon','typescript-icon'].map(n=>n+':'+(n in j.icons)).join(' '))"
```
Expected: все три `true`. Если какого-то нет, подобрать ближайшее имя из `Object.keys(j.icons).filter(k=>/vue|nuxt|typescript/.test(k))` и записать в отчёт.

- [ ] **Step 2: Падающий тест данных**

`src/data/stack.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { stack } from './stack'

describe('stack', () => {
  it('три технологии с внешними ссылками', () => {
    expect(stack.map((item) => item.id)).toEqual(['vue', 'nuxt', 'typescript'])
    for (const item of stack) {
      expect(item.url).toMatch(/^https:\/\//)
      expect(item.label.length).toBeGreaterThan(0)
      expect(item.icon).toBeTruthy()
    }
  })
})
```

- [ ] **Step 3: Данные**

`src/data/stack.ts`:

```ts
import type { Component } from 'vue'
import IconVue from '~icons/logos/vue'
import IconNuxt from '~icons/logos/nuxt-icon'
import IconTypeScript from '~icons/logos/typescript-icon'

export interface StackItem {
  id: string
  label: string
  url: string
  icon: Component
}

export const stack: StackItem[] = [
  { id: 'vue', label: 'Vue', url: 'https://vuejs.org/', icon: IconVue },
  { id: 'nuxt', label: 'Nuxt', url: 'https://nuxt.com/', icon: IconNuxt },
  { id: 'typescript', label: 'TypeScript', url: 'https://www.typescriptlang.org/', icon: IconTypeScript },
]
```

- [ ] **Step 4: Компонент чипа**

`src/components/home/TechChip.vue`:

```vue
<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  label: string
  url: string
  icon: Component
}>()
</script>

<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="press-scale inline-flex items-center gap-[4px] rounded-xs px-[6px] py-[2px] text-[13px] text-muted-foreground no-underline [transition:background-color_var(--dur-hover)_ease,color_var(--dur-hover)_ease,transform_var(--dur-press)_var(--ease-standard)] hover:bg-sunk hover:text-fg"
  >
    <component :is="icon" class="size-[15px] shrink-0" aria-hidden="true" />
    {{ label }}
  </a>
</template>
```

- [ ] **Step 5: Роль в `HomePage.vue`**

Импорты: `import TechChip from '@/components/home/TechChip.vue'` и `import { stack } from '@/data/stack'`. Строку роли `<p class="m-0 text-[16px] text-muted-foreground">{{ t('home.role') }}</p>` заменить на:

```vue
          <p class="m-0 flex flex-wrap items-center gap-x-[10px] gap-y-[2px] text-[16px] text-muted-foreground">
            {{ t('home.role') }}
            <span class="inline-flex items-center gap-[2px]">
              <TechChip v-for="item in stack" :key="item.id" :label="item.label" :url="item.url" :icon="item.icon" />
            </span>
          </p>
```

- [ ] **Step 6: Проверить и закоммитить**

Run: `pnpm vitest run src/data/stack.spec.ts && pnpm type-check && pnpm lint && pnpm test:run` (47 тестов).

```bash
git add package.json pnpm-lock.yaml src/data/stack.ts src/data/stack.spec.ts src/components/home/TechChip.vue src/pages/HomePage.vue
git commit -m "Show the stack as logo chips next to the role"
```

---

### Task 2: `useMoscowTime`

**Files:**
- Create: `src/composables/useMoscowTime.ts`, `src/composables/useMoscowTime.spec.ts`
- Modify: `src/components/AppHeader.vue`

- [ ] **Step 1: Падающий тест**

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { formatMoscowTime, useMoscowTime } from './useMoscowTime'

describe('useMoscowTime', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('форматирует время по Москве как ЧЧ:ММ', () => {
    vi.setSystemTime(new Date('2026-09-04T09:05:00Z'))
    expect(formatMoscowTime()).toBe('12:05')
  })

  it('обновляется, когда проходит минута', () => {
    vi.setSystemTime(new Date('2026-09-04T09:05:30Z'))
    const scope = effectScope()
    const { time } = scope.run(() => useMoscowTime())!
    expect(time.value).toBe('12:05')
    vi.setSystemTime(new Date('2026-09-04T09:06:30Z'))
    vi.advanceTimersByTime(1000)
    expect(time.value).toBe('12:06')
    scope.stop()
  })

  it('останавливает таймер вместе со scope', () => {
    const scope = effectScope()
    scope.run(() => useMoscowTime())
    scope.stop()
    expect(vi.getTimerCount()).toBe(0)
  })
})
```

- [ ] **Step 2: Реализовать**

```ts
import { onScopeDispose, ref } from 'vue'

export function formatMoscowTime(date = new Date()) {
  return date.toLocaleTimeString('ru-RU', {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Одни часы на шапку и карточку «Москве»: тикают раз в секунду, чтобы минута менялась без задержки.
export function useMoscowTime() {
  const time = ref(formatMoscowTime())
  const timer = setInterval(() => {
    time.value = formatMoscowTime()
  }, 1000)
  onScopeDispose(() => clearInterval(timer), true)
  return { time }
}
```

- [ ] **Step 3: Шапка**

В `AppHeader.vue` удалить `time`, `timer`, `updateTime`, `onMounted`/`onUnmounted` части про часы (остальной `onMounted`-код, если есть, оставить) и заменить на `const { time } = useMoscowTime()` с импортом из `@/composables/useMoscowTime`. Шаблон не меняется.

- [ ] **Step 4: Проверить и закоммитить**

Run: `pnpm vitest run src/composables/useMoscowTime.spec.ts && pnpm type-check && pnpm lint && pnpm test:run` (50).

```bash
git add src/composables/useMoscowTime.ts src/composables/useMoscowTime.spec.ts src/components/AppHeader.vue
git commit -m "Share the Moscow clock through useMoscowTime"
```

---

### Task 3: Всплывающие карточки в тексте

**Files:**
- Create: `src/components/ui/hover-card/HoverCard.vue`, `HoverCardTrigger.vue`, `HoverCardContent.vue`, `index.ts`
- Create: `src/components/home/HoverNote.vue`
- Modify: `src/app/i18n/locales/ru/home.json`, `src/app/i18n/locales/en/home.json`, `src/style.css` (только если нет `.ds-breathe`), `src/pages/HomePage.vue`

- [ ] **Step 1: Обёртки reka-ui**

`HoverCard.vue`:
```vue
<script setup lang="ts">
import type { HoverCardRootEmits, HoverCardRootProps } from 'reka-ui'
import { HoverCardRoot, useForwardPropsEmits } from 'reka-ui'

const props = withDefaults(defineProps<HoverCardRootProps>(), { openDelay: 120, closeDelay: 80 })
const emits = defineEmits<HoverCardRootEmits>()
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <HoverCardRoot data-slot="hover-card" v-bind="forwarded">
    <slot />
  </HoverCardRoot>
</template>
```

`HoverCardTrigger.vue`:
```vue
<script setup lang="ts">
import type { HoverCardTriggerProps } from 'reka-ui'
import { HoverCardTrigger } from 'reka-ui'

const props = defineProps<HoverCardTriggerProps>()
</script>

<template>
  <HoverCardTrigger data-slot="hover-card-trigger" v-bind="props">
    <slot />
  </HoverCardTrigger>
</template>
```

`HoverCardContent.vue`:
```vue
<script setup lang="ts">
import type { HoverCardContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { HoverCardContent, HoverCardPortal, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<HoverCardContentProps & { class?: HTMLAttributes['class'] }>(), {
  side: 'top',
  sideOffset: 8,
})
const forwarded = useForwardProps(reactiveOmit(props, 'class'))
</script>

<template>
  <HoverCardPortal>
    <HoverCardContent
      data-slot="hover-card-content"
      v-bind="{ ...$attrs, ...forwarded }"
      :class="
        cn(
          'z-50 flex flex-col gap-[2px] rounded-3 bg-raised px-[12px] py-[10px] whitespace-nowrap shadow-2',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-1 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none',
          props.class,
        )
      "
    >
      <slot />
    </HoverCardContent>
  </HoverCardPortal>
</template>
```

`index.ts`:
```ts
export { default as HoverCard } from './HoverCard.vue'
export { default as HoverCardTrigger } from './HoverCardTrigger.vue'
export { default as HoverCardContent } from './HoverCardContent.vue'
```

- [ ] **Step 2: `HoverNote.vue`**

```vue
<script setup lang="ts">
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

defineProps<{
  title: string
  text?: string
  href?: string
  dot?: boolean
}>()
</script>

<template>
  <HoverCard>
    <HoverCardTrigger as-child>
      <a
        v-if="href"
        :href="href"
        class="press-scale inline-block text-primary underline decoration-primary/35 decoration-[1.5px] underline-offset-[3px] [transition:text-decoration-color_var(--dur-hover)_ease,transform_var(--dur-press)_var(--ease-standard)] hover:decoration-primary"
      >
        <slot />
      </a>
      <span
        v-else
        tabindex="0"
        class="cursor-default rounded-[2px] text-fg underline decoration-faint decoration-dotted decoration-[1.5px] underline-offset-[3px]"
      >
        <slot />
      </span>
    </HoverCardTrigger>
    <HoverCardContent>
      <span class="flex items-center gap-[6px] text-[15.5px] font-semibold tracking-[-0.012em] text-fg">
        <span v-if="dot" class="ds-breathe size-[7px] shrink-0 rounded-full bg-mint" aria-hidden="true" />
        {{ title }}
      </span>
      <span v-if="text" class="t-small">{{ text }}</span>
    </HoverCardContent>
  </HoverCard>
</template>
```

Если `grep -n "\.ds-breathe" src/style.css` ничего не находит, добавить класс в `@layer components` (см. Global Constraints).

- [ ] **Step 3: Локали**

`ru/home.json`: заменить `"tech"` и добавить ключи (остальное без изменений):
```json
  "tech": "Живу в {city}, работаю {remote}, {open}.",
  "city": "Москве",
  "remote": "удалённо",
  "open": "открыт к предложениям",
  "notes": {
    "city": "GMT+3, Европа/Москва",
    "remote": { "title": "Из дома, по Москве", "text": "созвоны 10:00–19:00, готов к командировкам" },
    "open": { "title": "Ищу full-time", "text": "отвечаю в течение дня" }
  },
```
`en/home.json`:
```json
  "tech": "Based in {city}, working {remote}, {open}.",
  "city": "Moscow",
  "remote": "remotely",
  "open": "open to offers",
  "notes": {
    "city": "GMT+3, Europe/Moscow",
    "remote": { "title": "From home, on Moscow time", "text": "calls 10:00–19:00, open to business trips" },
    "open": { "title": "Looking for full-time", "text": "I answer within a day" }
  },
```

- [ ] **Step 4: `HomePage.vue`**

Импорты: `HoverNote` из `@/components/home/HoverNote.vue`, `useMoscowTime` из `@/composables/useMoscowTime`, `EMAIL` из `@/data/contact` (там уже есть `MAILTO`). В `<script setup>`: `const { time } = useMoscowTime()`. Второй абзац `<p v-motion v-bind="rise(DELAY_TECH)" class="t-body text-muted-foreground">{{ t('home.tech') }}</p>` заменить на:

```vue
        <I18nT
          v-motion
          v-bind="rise(DELAY_TECH)"
          keypath="home.tech"
          tag="p"
          scope="global"
          class="t-body text-muted-foreground"
        >
          <template #city>
            <HoverNote :title="time" :text="t('home.notes.city')">{{ t('home.city') }}</HoverNote>
          </template>
          <template #remote>
            <HoverNote :title="t('home.notes.remote.title')" :text="t('home.notes.remote.text')">{{ t('home.remote') }}</HoverNote>
          </template>
          <template #open>
            <HoverNote :href="MAILTO" :title="t('home.notes.open.title')" :text="`${EMAIL}, ${t('home.notes.open.text')}`" dot>{{ t('home.open') }}</HoverNote>
          </template>
        </I18nT>
```

Если `v-motion` на `I18nT` не срабатывает (директива на компоненте с `tag`), обернуть `I18nT` в `<div v-motion v-bind="rise(DELAY_TECH)">` и сказать в отчёте.

- [ ] **Step 5: Проверить и закоммитить**

Run: `pnpm type-check && pnpm lint && pnpm test:run` (50). `pnpm dev`: наведение на «Москве» показывает карточку со временем и «GMT+3, Европа/Москва»; на «удалённо» и «открыт к предложениям» свои; клик по «открыт к предложениям» открывает почту; Tab на слово открывает карточку.

```bash
git add src/components/ui/hover-card src/components/home/HoverNote.vue src/app/i18n/locales/ru/home.json src/app/i18n/locales/en/home.json src/pages/HomePage.vue
git add src/style.css   # только если добавляли .ds-breathe
git commit -m "Add hover notes to the about paragraph"
```

---

### Task 4: Третий абзац и достижения

**Files:**
- Create: `src/data/awards.ts`, `src/data/awards.spec.ts`, `src/components/home/AwardRow.vue`, `src/components/home/AwardRow.spec.ts`
- Create: `src/app/i18n/locales/ru/awards.json`, `src/app/i18n/locales/en/awards.json`
- Modify: `src/app/i18n/locales/ru/index.ts`, `src/app/i18n/locales/en/index.ts`, `src/app/i18n/locales/ru/home.json`, `src/app/i18n/locales/en/home.json`, `src/pages/HomePage.vue`

- [ ] **Step 1: Падающие тесты**

`src/data/awards.spec.ts`:
```ts
import { describe, it, expect } from 'vitest'
import ru from '@/app/i18n/locales/ru/awards.json'
import en from '@/app/i18n/locales/en/awards.json'
import { awards } from './awards'

describe('awards', () => {
  it('у каждого достижения есть тексты в обеих локалях', () => {
    for (const award of awards) {
      for (const locale of [ru, en]) {
        const item = (locale.items as Record<string, { title: string; subtitle: string }>)[award.id]
        expect(item?.title, award.id).toBeTruthy()
        expect(item?.subtitle, award.id).toBeTruthy()
      }
    }
  })

  it('идут от новых к старым', () => {
    const years = awards.map((award) => award.year)
    expect(years).toEqual([...years].sort((a, b) => b - a))
  })
})
```

`src/components/home/AwardRow.spec.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AwardRow from './AwardRow.vue'

describe('AwardRow', () => {
  it('без ссылки это article без стрелки', () => {
    const wrapper = mount(AwardRow, { props: { year: 2025, title: 'PROЦИФРУ', subtitle: 'победитель' } })
    expect(wrapper.element.tagName).toBe('ARTICLE')
    expect(wrapper.find('svg').exists()).toBe(false)
    expect(wrapper.text()).toContain('2025')
  })

  it('со ссылкой это a наружу со стрелкой', () => {
    const wrapper = mount(AwardRow, { props: { year: 2024, title: 'Yandex Cup', subtitle: 'полуфиналист', url: 'https://example.com' } })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('target')).toBe('_blank')
    expect(wrapper.find('svg').exists()).toBe(true)
  })
})
```

- [ ] **Step 2: Данные и локали**

`src/data/awards.ts`:
```ts
export interface Award {
  id: string
  year: number
  url?: string
}

export const awards: Award[] = [
  { id: 'procifru', year: 2025 },
  { id: 'yandexCup', year: 2024 },
  { id: 'hackathons', year: 2024 },
]
```

`ru/awards.json`:
```json
{
  "items": {
    "procifru": { "title": "PROЦИФРУ", "subtitle": "победитель" },
    "yandexCup": { "title": "Yandex Cup, Frontend", "subtitle": "полуфиналист" },
    "hackathons": { "title": "Хакатоны Газпрома и Моспрома", "subtitle": "финалист" }
  }
}
```
`en/awards.json`:
```json
{
  "items": {
    "procifru": { "title": "PROTSIFRU", "subtitle": "winner" },
    "yandexCup": { "title": "Yandex Cup, Frontend", "subtitle": "semi-finalist" },
    "hackathons": { "title": "Gazprom and Mosprom hackathons", "subtitle": "finalist" }
  }
}
```
В обоих `index.ts` добавить `import awards from './awards.json'` и ключ `awards` в экспорт (по образцу остальных).

`home.json` добавить `"more"`: ru «Люблю задачи, где звук и графика встречаются с вебом: плеер на Tauri, библиотека для Web Audio, тюнер по микрофону. Всё это в открытом коде.», en «I like work where sound and graphics meet the web: a Tauri player, a Web Audio library, a microphone tuner. All of it open source.».

- [ ] **Step 3: `AwardRow.vue`**

```vue
<script setup lang="ts">
import IconArrowOutward from '~icons/material-symbols/arrow-outward-rounded'

defineProps<{
  year: number
  title: string
  subtitle: string
  url?: string
}>()
</script>

<template>
  <component
    :is="url ? 'a' : 'article'"
    :href="url"
    :target="url ? '_blank' : undefined"
    :rel="url ? 'noopener noreferrer' : undefined"
    :class="[
      'flex items-baseline gap-[12px] -mx-[12px] rounded-3 px-[12px] py-[8px] text-fg no-underline',
      url && 'press-scale [transition:background-color_var(--dur-surface)_ease,transform_var(--dur-press)_var(--ease-standard)] hover:bg-sunk',
    ]"
  >
    <span class="t-hand w-[56px] shrink-0 text-[20px] text-primary">{{ year }}</span>
    <span class="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-[8px]">
      <span class="text-[15.5px] font-semibold tracking-[-0.012em]">{{ title }}</span>
      <span class="t-small">{{ subtitle }}</span>
    </span>
    <IconArrowOutward v-if="url" class="size-5 shrink-0 self-center text-faint" aria-hidden="true" />
  </component>
</template>
```

- [ ] **Step 4: `HomePage.vue`**

Импорты `AwardRow` и `awards`. Константы `DELAY_MORE = 0.2`, `DELAY_AWARDS = 0.26` рядом с остальными. После второго абзаца (внутри того же `div.flex.max-w-[52ch]…`) добавить:

```vue
        <p v-motion v-bind="rise(DELAY_MORE)" class="t-body text-muted-foreground">
          {{ t('home.more') }}
        </p>
```

После этого `div` (но внутри первой `section`) добавить:

```vue
      <div v-motion v-bind="rise(DELAY_AWARDS)" class="flex flex-col">
        <AwardRow
          v-for="award in awards"
          :key="award.id"
          :year="award.year"
          :title="t(`awards.items.${award.id}.title`)"
          :subtitle="t(`awards.items.${award.id}.subtitle`)"
          :url="award.url"
        />
      </div>
```

- [ ] **Step 5: Проверить и закоммитить**

Run: `pnpm vitest run src/data/awards.spec.ts src/components/home/AwardRow.spec.ts && pnpm type-check && pnpm lint && pnpm test:run` (54).

```bash
git add src/data/awards.ts src/data/awards.spec.ts src/components/home/AwardRow.vue src/components/home/AwardRow.spec.ts src/app/i18n/locales src/pages/HomePage.vue
git commit -m "Add the sound-and-graphics paragraph and the awards list"
```

---

### Task 5: Контакты в варианте H

**Files:**
- Create: `src/components/ui/tooltip/TooltipProvider.vue`, `Tooltip.vue`, `TooltipTrigger.vue`, `TooltipContent.vue`, `index.ts`
- Create: `src/components/home/CopyEmail.vue`, `src/components/home/CopyEmail.spec.ts`
- Modify: `src/app/i18n/locales/ru/contact.json`, `src/app/i18n/locales/en/contact.json`, `src/pages/HomePage.vue`

- [ ] **Step 1: Падающий тест**

`CopyEmail.spec.ts`:
```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import CopyEmail from './CopyEmail.vue'

const i18n = createI18n({ legacy: false, locale: 'ru', messages: { ru: { contact: { copied: 'Скопировано' } } } })
const mountEmail = () => mount(CopyEmail, { props: { email: 'a@b.c' }, global: { plugins: [i18n] } })

describe('CopyEmail', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('копирует адрес и показывает подпись на 1.4 с', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const wrapper = mountEmail()
    await wrapper.get('button').trigger('click')
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('a@b.c'))
    await vi.advanceTimersByTimeAsync(0)
    expect(wrapper.text()).toContain('Скопировано')
    await vi.advanceTimersByTimeAsync(1400)
    expect(wrapper.text()).not.toContain('Скопировано')
  })

  it('без clipboard клик ничего не ломает', async () => {
    vi.stubGlobal('navigator', {})
    const wrapper = mountEmail()
    await expect(wrapper.get('button').trigger('click')).resolves.toBeUndefined()
    expect(wrapper.text()).not.toContain('Скопировано')
  })
})
```

- [ ] **Step 2: `CopyEmail.vue`**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ email: string }>()
const { t } = useI18n()

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  const clipboard = navigator.clipboard
  if (!clipboard) return
  try {
    await clipboard.writeText(props.email)
  } catch {
    return
  }
  copied.value = true
  clearTimeout(timer)
  timer = setTimeout(() => {
    copied.value = false
  }, 1400)
}
</script>

<template>
  <span class="inline-flex flex-wrap items-center gap-[12px]">
    <button
      type="button"
      class="group press-scale relative m-0 cursor-pointer bg-transparent p-0 text-left text-[24px] leading-[1.15] font-semibold tracking-[-0.024em] text-fg"
      @click="copy"
    >
      {{ email }}
      <span
        class="absolute inset-x-0 -bottom-[4px] h-[3px] origin-left scale-x-0 rounded-[2px] bg-primary [transition:scale_0.35s_var(--ease-standard)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </button>
    <span
      class="t-small text-primary [transition:opacity_var(--dur-hover)_ease]"
      :class="copied ? 'opacity-100' : 'opacity-0'"
      aria-live="polite"
    >
      {{ copied ? t('contact.copied') : '' }}
    </span>
  </span>
</template>
```

- [ ] **Step 3: Обёртки tooltip**

`TooltipProvider.vue`:
```vue
<script setup lang="ts">
import type { TooltipProviderProps } from 'reka-ui'
import { TooltipProvider } from 'reka-ui'

const props = withDefaults(defineProps<TooltipProviderProps>(), { delayDuration: 150 })
</script>

<template>
  <TooltipProvider v-bind="props">
    <slot />
  </TooltipProvider>
</template>
```
`Tooltip.vue`:
```vue
<script setup lang="ts">
import type { TooltipRootEmits, TooltipRootProps } from 'reka-ui'
import { TooltipRoot, useForwardPropsEmits } from 'reka-ui'

const props = defineProps<TooltipRootProps>()
const emits = defineEmits<TooltipRootEmits>()
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <TooltipRoot data-slot="tooltip" v-bind="forwarded">
    <slot />
  </TooltipRoot>
</template>
```
`TooltipTrigger.vue`:
```vue
<script setup lang="ts">
import type { TooltipTriggerProps } from 'reka-ui'
import { TooltipTrigger } from 'reka-ui'

const props = defineProps<TooltipTriggerProps>()
</script>

<template>
  <TooltipTrigger data-slot="tooltip-trigger" v-bind="props">
    <slot />
  </TooltipTrigger>
</template>
```
`TooltipContent.vue`:
```vue
<script setup lang="ts">
import type { TooltipContentEmits, TooltipContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { TooltipContent, TooltipPortal, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TooltipContentProps & { class?: HTMLAttributes['class'] }>(), {
  side: 'bottom',
  sideOffset: 8,
})
const emits = defineEmits<TooltipContentEmits>()
const forwarded = useForwardPropsEmits(reactiveOmit(props, 'class'), emits)
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      data-slot="tooltip-content"
      v-bind="{ ...$attrs, ...forwarded }"
      :class="
        cn(
          'z-50 rounded-2 bg-raised px-[10px] py-[6px] t-code text-[13px] text-fg shadow-2',
          'data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:slide-in-from-top-1 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none',
          props.class,
        )
      "
    >
      <slot />
    </TooltipContent>
  </TooltipPortal>
</template>
```
`index.ts`:
```ts
export { default as TooltipProvider } from './TooltipProvider.vue'
export { default as Tooltip } from './Tooltip.vue'
export { default as TooltipTrigger } from './TooltipTrigger.vue'
export { default as TooltipContent } from './TooltipContent.vue'
```

- [ ] **Step 4: Локали и `HomePage.vue`**

`contact.json` ru: добавить `"copied": "Скопировано"`; en: `"copied": "Copied"`.

В `HomePage.vue` импорты: `CopyEmail`, `Tooltip, TooltipContent, TooltipProvider, TooltipTrigger` из `@/components/ui/tooltip`, `EMAIL` (если ещё нет). Блок действий контактов (`<div class="flex flex-wrap items-center gap-x-[var(--space-6)] …">` с `Button` «Написать» и циклом `variant="link"`) заменить на:

```vue
      <div class="flex flex-col gap-[var(--space-4)]">
        <CopyEmail :email="EMAIL" />

        <div class="flex flex-wrap items-center gap-[var(--space-3)]">
          <Button as="a" :href="MAILTO" size="lg">
            <IconMail aria-hidden="true" />
            {{ t('home.actions.write') }}
          </Button>

          <TooltipProvider>
            <Tooltip v-for="link in socials" :key="link.id">
              <TooltipTrigger as-child>
                <Button
                  as="a"
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="icon-lg"
                  :aria-label="t(`contact.items.${link.id}`)"
                >
                  <component :is="link.icon" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{{ link.handle }}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
```

Импорт `IconArrowOutward` в `HomePage.vue` после этого не нужен — удалить, если больше нигде в файле не используется.

- [ ] **Step 5: Проверить и закоммитить**

Run: `pnpm vitest run src/components/home/CopyEmail.spec.ts && pnpm type-check && pnpm lint && pnpm test:run` (56). `pnpm dev`: клик по адресу показывает «Скопировано»; наведение на иконки показывает `@EG0RK13` / `Eg0r0k`; кнопка «Написать» и иконки одной высоты 44px.

```bash
git add src/components/ui/tooltip src/components/home/CopyEmail.vue src/components/home/CopyEmail.spec.ts src/app/i18n/locales/ru/contact.json src/app/i18n/locales/en/contact.json src/pages/HomePage.vue
git commit -m "Make the email the centre of the contact section with icon links"
```

---

### Task 6: Финальный прогон

- [ ] `pnpm lint && pnpm type-check && pnpm test:run && pnpm build` — всё зелёное; при автофиксах lint отдельный коммит `Lint fixes`.
- [ ] Playwright по спеку делает контроллер.
