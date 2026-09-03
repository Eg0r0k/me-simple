# Превью проекта у курсора и страница проектов: план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** На главной при наведении на строку проекта у курсора появляется карточка со скриншотом, заголовок секции показывает счётчик и ведёт на страницу `/projects` с карточками проектов.

**Architecture:** Чистые функции выбора кадра, наклона и стороны живут в `preview.ts` и покрыты vitest. `ProjectShot.vue` рисует один кадр (картинка или плашка с командой) и используется в двух местах: в плавающей карточке `ProjectPreview.vue` на главной и в карточках `ProjectsPage.vue`. `ProjectList.vue` держит состояние наведения и координаты курсора в motion values, `ProjectPreview.vue` превращает их в пружины и рендерит стопку кадров.

**Tech Stack:** Vue 3.5 `<script setup>` + TypeScript, motion-v 2.4 (`useMotionValue`, `useSpring`, `useTransform`, `motion.div`), `@vueuse/core` (`useMediaQuery`, `usePreferredReducedMotion`, `useWindowSize`), vue-router 5, vue-i18n 11, Tailwind 4 с токенами из `src/style.css`, vitest + jsdom, pnpm, ffmpeg для WebP.

Спек: `docs/superpowers/specs/2026-09-03-project-cursor-preview-design.md`.

## Global Constraints

- Пакетный менеджер: `pnpm`. Команды: `pnpm test:run`, `pnpm type-check`, `pnpm lint`, `pnpm dev`.
- Никаких `border`, `divide-*`; разделение фоном (`bg-sunk`) и тенью `shadow-2` (единственная тень, разрешённая для карточки).
- `transition` только по `background-color`, `color`, `opacity`, `transform`, `filter`. Никакого `transition-all`.
- Ховер-эффекты только под `hover: hover`; Tailwind 4 `hover:` уже так работает.
- Каждый нажимаемый элемент получает класс `press-scale`.
- Мета-текст (счётчик, год) — класс `t-label`. Моно (`t-code`) только для `npm i lyra-audio`.
- Иконки только `~icons/material-symbols/<name>-rounded`.
- Reduced motion: `MotionConfig reduced-motion="user"` в `App.vue` действует только на `:animate` у `motion.*`; пружины `useSpring` его не читают. Поэтому в компоненте `usePreferredReducedMotion` обязателен: под ним наклон 0, а позиция берётся из сырых значений курсора, минуя пружины.
- Анимации появления секций только на главной. На `/projects` их нет.
- `noUncheckedIndexedAccess` включён: индексация массива даёт `T | undefined`.
- Комментарии в коде и тестах на русском, как в `src/lib/theme/clipPath.spec.ts`.
- Коммит после каждой задачи. Сообщения коммитов на английском, в стиле `git log`: «Add …», «Turn … into …».

## Карта файлов

| Файл | Ответственность |
|---|---|
| `public/projects/**/*.webp` | Сжатые кадры 1120px для карточек (создаются из PNG) |
| `src/data/projects.ts` | Типы `PreviewLocale`, `ProjectPreview`, поле `preview` у каждого проекта |
| `src/components/project-list/preview.ts` | Чистые функции: `toPreviewLocale`, `resolvePreviewSrc`, `clampTilt`, `placeCard`, константы карточки |
| `src/components/project-list/preview.spec.ts` | Тесты чистых функций |
| `src/components/project-list/ProjectShot.vue` | Один кадр 16:9: картинка или плашка с командой |
| `src/components/project-list/ProjectPreview.vue` | Плавающая карточка: пружины, наклон, стопка кадров |
| `src/components/project-list/ProjectList.vue` | Строки проектов, состояние наведения, координаты курсора |
| `src/components/project-list/index.ts` | Реэкспорт `ProjectList`, `ProjectShot` |
| `src/pages/HomePage.vue` | Заголовок-ссылка со счётчиком, `<ProjectList>` вместо цикла строк |
| `src/pages/ProjectsPage.vue` | Страница `/projects` с сеткой карточек |
| `src/router/route-names.ts`, `route-locations.ts`, `routes/pages.ts` | Маршрут `projects` |
| `src/app/i18n/locales/{ru,en}/projects.json` | Ключ `back` |

---

### Task 1: WebP-кадры проектов

**Files:**
- Create: `public/projects/audiogram/app-ru.webp`, `public/projects/audiogram/app-en.webp`
- Create: `public/projects/TunA/app-ru.webp`, `public/projects/TunA/app-en.webp`
- Create: `public/projects/typemore/app.webp`

**Interfaces:**
- Produces: пять файлов по путям выше. Task 2 ссылается на них строками `/projects/<dir>/<name>.webp`.

- [ ] **Step 1: Убедиться, что ffmpeg и исходники на месте**

Run (Git Bash):
```bash
cd "C:/Users/Егор/Desktop/me-simple" && ffmpeg -version | head -1 && ls public/projects/audiogram public/projects/TunA public/projects/typemore
```
Expected: строка версии ffmpeg и пять PNG: `app-en.png`, `app-ru.png` в audiogram и TunA, `app.png` в typemore.

- [ ] **Step 2: Сконвертировать**

Run (Git Bash):
```bash
cd "C:/Users/Егор/Desktop/me-simple" && for f in public/projects/audiogram/app-ru public/projects/audiogram/app-en public/projects/TunA/app-ru public/projects/TunA/app-en public/projects/typemore/app; do ffmpeg -loglevel error -y -i "$f.png" -vf "scale=1120:-2" -c:v libwebp -quality 82 "$f.webp"; done && ls -la public/projects/*/*.webp
```
Expected: пять `.webp`, каждый заметно меньше 150 КБ. `-2` в scale держит высоту чётной, иначе libwebp может отказать.

- [ ] **Step 3: Проверить размеры кадра**

Run (Git Bash):
```bash
cd "C:/Users/Егор/Desktop/me-simple" && ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 public/projects/audiogram/app-ru.webp public/projects/typemore/app.webp
```
Expected: ширина `1120` у каждого.

- [ ] **Step 4: Commit**

```bash
git add public/projects
git commit -m "Add project screenshots and their 1120px WebP frames"
```

Примечание: PNG-исходники ещё не в git (`?? public/projects/`), они попадают в этот же коммит вместе с WebP, как и сказано в спеке.

---

### Task 2: Данные `preview` и чистые функции

**Files:**
- Modify: `src/data/projects.ts`
- Create: `src/components/project-list/preview.ts`
- Test: `src/components/project-list/preview.spec.ts`

**Interfaces:**
- Produces (в `src/data/projects.ts`):
  ```ts
  export type PreviewLocale = 'ru' | 'en'
  export type ProjectPreview =
    | { kind: 'image'; src: Partial<Record<PreviewLocale, string>> }
    | { kind: 'command'; command: string }
  export interface Project { /* … существующие поля … */ preview: ProjectPreview }
  ```
- Produces (в `preview.ts`):
  ```ts
  export const CARD_WIDTH = 280
  export const CARD_HEIGHT = 157.5           // 280 * 9 / 16
  export const CARD_OFFSET = 20              // отступ от курсора
  export const VIEWPORT_MARGIN = 16
  export const TILT_FACTOR = 0.004
  export const TILT_MAX = 6
  export function toPreviewLocale(locale: string): PreviewLocale
  export function resolvePreviewSrc(preview: ProjectPreview, locale: PreviewLocale): string | null
  export function clampTilt(velocity: number): number
  export function placeCard(pointerX: number, cardWidth: number, viewportWidth: number): 'right' | 'left'
  ```

- [ ] **Step 1: Добавить типы и поле `preview` в данные**

В `src/data/projects.ts` заменить блок типов и массив на:

```ts
import type { Component } from 'vue'
import IconGraphicEq from '~icons/material-symbols/graphic-eq-rounded'
import IconEqualizer from '~icons/material-symbols/equalizer-rounded'
import IconKeyboard from '~icons/material-symbols/keyboard-rounded'
import IconTune from '~icons/material-symbols/tune-rounded'

export type ProjectTone = 'sky' | 'peri' | 'amber' | 'mint' | 'clay'

export type PreviewLocale = 'ru' | 'en'

// Кадр проекта: скриншот по языку либо команда для плашки, если скриншота нет.
export type ProjectPreview =
  | { kind: 'image'; src: Partial<Record<PreviewLocale, string>> }
  | { kind: 'command'; command: string }

export interface Project {
  slug: string
  title: string
  captionKey: string
  year: number
  tone: ProjectTone
  icon: Component
  url?: string
  preview: ProjectPreview
}

export const projects: Project[] = [
  {
    slug: 'audiogram',
    title: 'Audiogram',
    captionKey: 'projects.items.audiogram',
    year: 2025,
    tone: 'sky',
    icon: IconGraphicEq,
    url: 'https://github.com/Eg0r0k/Audiogram',
    preview: {
      kind: 'image',
      src: { ru: '/projects/audiogram/app-ru.webp', en: '/projects/audiogram/app-en.webp' },
    },
  },
  {
    slug: 'lyra-audio',
    title: 'lyra-audio',
    captionKey: 'projects.items.lyraAudio',
    year: 2025,
    tone: 'peri',
    icon: IconEqualizer,
    url: 'https://npmjs.com/package/lyra-audio',
    preview: { kind: 'command', command: 'npm i lyra-audio' },
  },
  {
    slug: 'typemore',
    title: 'TypeMore',
    captionKey: 'projects.items.typemore',
    year: 2024,
    tone: 'amber',
    icon: IconKeyboard,
    url: 'https://typemore.elackov.com/',
    preview: { kind: 'image', src: { en: '/projects/typemore/app.webp' } },
  },
  {
    slug: 'tuna',
    title: 'TunA',
    captionKey: 'projects.items.tuna',
    year: 2024,
    tone: 'mint',
    icon: IconTune,
    url: 'https://eg0r0k.github.io/TunA/',
    preview: {
      kind: 'image',
      src: { ru: '/projects/TunA/app-ru.webp', en: '/projects/TunA/app-en.webp' },
    },
  },
]
```

- [ ] **Step 2: Написать падающие тесты**

Создать `src/components/project-list/preview.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import type { ProjectPreview } from '@/data/projects'
import { clampTilt, placeCard, resolvePreviewSrc, toPreviewLocale } from './preview'

describe('toPreviewLocale', () => {
  it('русский и его региональные варианты дают ru', () => {
    expect(toPreviewLocale('ru')).toBe('ru')
    expect(toPreviewLocale('ru-RU')).toBe('ru')
  })

  it('всё остальное даёт en', () => {
    expect(toPreviewLocale('en')).toBe('en')
    expect(toPreviewLocale('de')).toBe('en')
  })
})

describe('resolvePreviewSrc', () => {
  const both: ProjectPreview = { kind: 'image', src: { ru: '/ru.webp', en: '/en.webp' } }
  const onlyEn: ProjectPreview = { kind: 'image', src: { en: '/en.webp' } }
  const onlyRu: ProjectPreview = { kind: 'image', src: { ru: '/ru.webp' } }
  const command: ProjectPreview = { kind: 'command', command: 'npm i x' }

  it('берёт кадр текущего языка', () => {
    expect(resolvePreviewSrc(both, 'ru')).toBe('/ru.webp')
    expect(resolvePreviewSrc(both, 'en')).toBe('/en.webp')
  })

  it('без кадра на текущем языке падает на en', () => {
    expect(resolvePreviewSrc(onlyEn, 'ru')).toBe('/en.webp')
  })

  it('без en берёт первый доступный', () => {
    expect(resolvePreviewSrc(onlyRu, 'en')).toBe('/ru.webp')
  })

  it('у плашки с командой кадра нет', () => {
    expect(resolvePreviewSrc(command, 'ru')).toBeNull()
  })
})

describe('clampTilt', () => {
  it('в покое наклона нет', () => {
    expect(clampTilt(0)).toBe(0)
  })

  it('внутри диапазона угол пропорционален скорости', () => {
    expect(clampTilt(500)).toBeCloseTo(2)
    expect(clampTilt(-500)).toBeCloseTo(-2)
  })

  it('угол ограничен шестью градусами в обе стороны', () => {
    expect(clampTilt(5000)).toBe(6)
    expect(clampTilt(-5000)).toBe(-6)
  })
})

describe('placeCard', () => {
  // Карточка 280px, отступ от курсора 20px, поле у края окна 16px.
  it('ставит карточку справа, когда она помещается', () => {
    expect(placeCard(100, 280, 1000)).toBe('right')
  })

  it('перекидывает влево, когда правый край уходит за окно', () => {
    // 700 + 20 + 280 = 1000 > 1000 - 16
    expect(placeCard(700, 280, 1000)).toBe('left')
  })

  it('граница: ровно помещается — остаётся справа', () => {
    // 684 + 20 + 280 = 984 = 1000 - 16
    expect(placeCard(684, 280, 1000)).toBe('right')
  })
})
```

- [ ] **Step 3: Запустить тесты, убедиться, что падают**

Run: `pnpm vitest run src/components/project-list/preview.spec.ts`
Expected: FAIL, `Failed to resolve import "./preview"`.

- [ ] **Step 4: Реализовать `preview.ts`**

Создать `src/components/project-list/preview.ts`:

```ts
import type { PreviewLocale, ProjectPreview } from '@/data/projects'

export const CARD_WIDTH = 280
export const CARD_HEIGHT = (CARD_WIDTH * 9) / 16
export const CARD_OFFSET = 20
export const VIEWPORT_MARGIN = 16
export const TILT_FACTOR = 0.004
export const TILT_MAX = 6

export function toPreviewLocale(locale: string): PreviewLocale {
  return locale.startsWith('ru') ? 'ru' : 'en'
}

// Кадр текущего языка, иначе en, иначе первый, который есть. У плашки кадра нет.
export function resolvePreviewSrc(preview: ProjectPreview, locale: PreviewLocale): string | null {
  if (preview.kind !== 'image') return null
  return preview.src[locale] ?? preview.src.en ?? Object.values(preview.src)[0] ?? null
}

// Наклон по горизонтальной скорости пружины, px/s → градусы, не больше ±6.
export function clampTilt(velocity: number): number {
  const raw = velocity * TILT_FACTOR
  return Math.max(-TILT_MAX, Math.min(TILT_MAX, raw))
}

// Карточка стоит справа от курсора, пока её правый край не упирается в поле окна.
export function placeCard(
  pointerX: number,
  cardWidth: number,
  viewportWidth: number,
): 'right' | 'left' {
  const rightEdge = pointerX + CARD_OFFSET + cardWidth
  return rightEdge <= viewportWidth - VIEWPORT_MARGIN ? 'right' : 'left'
}
```

- [ ] **Step 5: Запустить тесты, убедиться, что проходят**

Run: `pnpm vitest run src/components/project-list/preview.spec.ts`
Expected: PASS, 12 тестов.

- [ ] **Step 6: Проверить типы**

Run: `pnpm type-check`
Expected: без ошибок. Поле `preview` обязательное, все четыре проекта его получили.

- [ ] **Step 7: Commit**

```bash
git add src/data/projects.ts src/components/project-list/preview.ts src/components/project-list/preview.spec.ts
git commit -m "Add project preview data and the pure helpers behind the cursor card"
```

---

### Task 3: Кадр проекта `ProjectShot.vue`

**Files:**
- Create: `src/components/project-list/ProjectShot.vue`
- Create: `src/components/project-list/index.ts`

**Interfaces:**
- Consumes: `Project`, `PreviewLocale` из `@/data/projects`; `resolvePreviewSrc` из `./preview`.
- Produces: компонент с пропсами `{ project: Project; locale: PreviewLocale }`, корень `div` с `aspect-video`, радиус не задаёт (задаёт родитель через `overflow-hidden rounded-*`).

- [ ] **Step 1: Создать компонент**

`src/components/project-list/ProjectShot.vue`:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { PreviewLocale, Project, ProjectTone } from '@/data/projects'
import { resolvePreviewSrc } from './preview'

const props = defineProps<{
  project: Project
  locale: PreviewLocale
}>()

const src = computed(() => resolvePreviewSrc(props.project.preview, props.locale))

const TONE_BG: Record<ProjectTone, string> = {
  sky: 'bg-sky-soft',
  peri: 'bg-peri-soft',
  amber: 'bg-amber-soft',
  mint: 'bg-mint-soft',
  clay: 'bg-clay-soft',
}

const TONE_INK: Record<ProjectTone, string> = {
  sky: 'text-sky-ink',
  peri: 'text-peri-ink',
  amber: 'text-amber-ink',
  mint: 'text-mint-ink',
  clay: 'text-clay-ink',
}
</script>

<template>
  <div class="relative aspect-video overflow-hidden bg-sunk">
    <!-- alt пустой: название проекта стоит рядом текстом. -->
    <img
      v-if="src"
      :src="src"
      alt=""
      decoding="async"
      draggable="false"
      class="absolute inset-0 size-full object-cover object-left-top select-none"
    />
    <div
      v-else-if="project.preview.kind === 'command'"
      :class="[
        'absolute inset-0 flex items-center justify-center t-code text-[14px]',
        TONE_BG[project.tone],
        TONE_INK[project.tone],
      ]"
    >
      {{ project.preview.command }}
    </div>
  </div>
</template>
```

- [ ] **Step 2: Создать индекс**

`src/components/project-list/index.ts`:

```ts
export { default as ProjectShot } from './ProjectShot.vue'
```

(`ProjectList` добавится в индекс в Task 4.)

- [ ] **Step 3: Проверить типы и линт**

Run: `pnpm type-check && pnpm lint`
Expected: без ошибок.

- [ ] **Step 4: Commit**

```bash
git add src/components/project-list/ProjectShot.vue src/components/project-list/index.ts
git commit -m "Add ProjectShot: one 16:9 frame per project, screenshot or install command"
```

---

### Task 4: Плавающая карточка и список проектов на главной

**Files:**
- Create: `src/components/project-list/ProjectPreview.vue`
- Create: `src/components/project-list/ProjectList.vue`
- Modify: `src/components/project-list/index.ts`
- Modify: `src/pages/HomePage.vue` (секция проектов, строки 74–95)

**Interfaces:**
- Consumes: `ProjectShot`, константы и функции из `./preview`, `ListRow` из `@/components/ui/list-row`.
- Produces: `ProjectList` с пропсом `{ projects: Project[] }`, рендерит список строк и карточку.

- [ ] **Step 1: Создать `ProjectPreview.vue`**

```vue
<script setup lang="ts">
import { computed, watch } from 'vue'
import type { MotionValue } from 'motion-v'
import { motion, useSpring, useTransform } from 'motion-v'
import { usePreferredReducedMotion, useWindowSize } from '@vueuse/core'
import type { PreviewLocale, Project } from '@/data/projects'
import { CARD_HEIGHT, CARD_OFFSET, CARD_WIDTH, clampTilt, placeCard } from './preview'
import ProjectShot from './ProjectShot.vue'

const props = defineProps<{
  projects: Project[]
  activeSlug: string | null
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
  locale: PreviewLocale
}>()

const EASE: [number, number, number, number] = [0.2, 0, 0.2, 1]
const FOLLOW = { stiffness: 400, damping: 40, mass: 1 }
const TILT = { stiffness: 200, damping: 30 }

const reduced = usePreferredReducedMotion()
const noMotion = computed(() => reduced.value === 'reduce')
const { width: viewportWidth } = useWindowSize()

// Пружины идут за курсором; motion values обновляют DOM мимо рендера Vue.
const x = useSpring(props.pointerX, FOLLOW)
const y = useSpring(props.pointerY, FOLLOW)

// Наклон из скорости пружины по x, сам тоже через пружину, чтобы не дёргался.
const tiltTarget = useTransform(() => (noMotion.value ? 0 : clampTilt(x.getVelocity())))
const rotate = useSpring(tiltTarget, TILT)

// Сторона считается от текущего положения пружины: карточка перекидывается влево
// без анимации, когда её правый край упирается в поле окна.
const translateX = useTransform(() => {
  const px = x.get()
  return placeCard(px, CARD_WIDTH, viewportWidth.value) === 'right'
    ? px + CARD_OFFSET
    : px - CARD_OFFSET - CARD_WIDTH
})
const translateY = useTransform(() => y.get() - CARD_HEIGHT / 2)

const visible = computed(() => props.activeSlug !== null)

// При первом появлении пружина стартует из точки курсора, а не из угла окна.
watch(
  () => props.activeSlug,
  (slug, prev) => {
    if (slug !== null && prev === null) {
      x.jump(props.pointerX.get())
      y.jump(props.pointerY.get())
    }
  },
)
</script>

<template>
  <motion.div
    aria-hidden="true"
    class="pointer-events-none fixed top-0 left-0 z-30 w-[280px] overflow-hidden rounded-3 bg-sunk shadow-2 will-change-transform"
    :style="{ x: translateX, y: translateY, rotate }"
    :initial="false"
    :animate="{ opacity: visible ? 1 : 0, scale: visible || noMotion ? 1 : 0.96 }"
    :transition="{ duration: 0.18, ease: EASE }"
  >
    <div class="relative aspect-video">
      <div
        v-for="project in projects"
        :key="project.slug"
        :class="[
          'absolute inset-0 [transition:opacity_220ms_var(--ease-standard),transform_220ms_var(--ease-standard)]',
          project.slug === activeSlug ? 'opacity-100 translate-y-0' : 'opacity-0',
          project.slug === activeSlug || noMotion ? '' : 'translate-y-2',
        ]"
      >
        <ProjectShot :project="project" :locale="locale" />
      </div>
    </div>
  </motion.div>
</template>
```

Почему так:
- `x`/`y` через `position: fixed` и `translate`, координаты курсора берутся как `clientX`/`clientY`, поэтому скролл не мешает.
- Все кадры смонтированы всегда: картинки грузятся один раз, кроссфейд по CSS.
- `translate-y-2` = 8px, как в спеке.

- [ ] **Step 2: Создать `ProjectList.vue`**

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMediaQuery } from '@vueuse/core'
import { useMotionValue } from 'motion-v'
import { ListRow } from '@/components/ui/list-row'
import IconArrowOutward from '~icons/material-symbols/arrow-outward-rounded'
import type { Project } from '@/data/projects'
import { toPreviewLocale } from './preview'
import ProjectPreview from './ProjectPreview.vue'

defineProps<{
  projects: Project[]
}>()

const { t, locale } = useI18n()

// Карточка только там, где есть ховер и точный указатель. На таче список как был.
const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')

const hoveredSlug = ref<string | null>(null)
const pointerX = useMotionValue(0)
const pointerY = useMotionValue(0)
const previewLocale = computed(() => toPreviewLocale(locale.value))

const onPointerMove = (event: PointerEvent) => {
  pointerX.set(event.clientX)
  pointerY.set(event.clientY)
}
</script>

<template>
  <div class="flex flex-col" @pointermove="onPointerMove" @pointerleave="hoveredSlug = null">
    <ListRow
      v-for="project in projects"
      :key="project.slug"
      :as="project.url ? 'a' : 'article'"
      :href="project.url"
      :target="project.url ? '_blank' : undefined"
      :rel="project.url ? 'noopener noreferrer' : undefined"
      :tone="project.tone"
      :icon="project.icon"
      :title="project.title"
      :caption="t(project.captionKey)"
      :year="project.year"
      :trailing-icon="project.url ? IconArrowOutward : null"
      @pointerenter="hoveredSlug = project.slug"
    />

    <ProjectPreview
      v-if="canHover"
      :projects="projects"
      :active-slug="hoveredSlug"
      :pointer-x="pointerX"
      :pointer-y="pointerY"
      :locale="previewLocale"
    />
  </div>
</template>
```

`@pointerenter` на `ListRow` проваливается на корневой `Primitive` как обычный атрибут: у компонента один корень и `inheritAttrs` по умолчанию.

- [ ] **Step 3: Обновить индекс**

`src/components/project-list/index.ts`:

```ts
export { default as ProjectList } from './ProjectList.vue'
export { default as ProjectShot } from './ProjectShot.vue'
```

- [ ] **Step 4: Подключить в `HomePage.vue`**

В `<script setup>` добавить импорт и убрать ставший ненужным:

```ts
import { ProjectList } from '@/components/project-list'
```

`ListRow` и `IconArrowOutward` остаются: они нужны секции опыта и контактам.

Секцию проектов (сейчас `<section v-motion v-bind="reveal()" …>` с заголовком `projects.title` и циклом `ListRow`) заменить на:

```vue
    <section v-motion v-bind="reveal()" class="flex flex-col gap-[var(--space-4)]">
      <h2 class="m-0 text-[13.5px] font-semibold text-muted-foreground">
        {{ t('projects.title') }}
      </h2>

      <ProjectList :projects="projects" />
    </section>
```

(Заголовок станет ссылкой со счётчиком в Task 5.)

- [ ] **Step 5: Проверить типы, линт, тесты**

Run: `pnpm type-check && pnpm lint && pnpm test:run`
Expected: без ошибок, 12 тестов проходят (плюс существующие).

- [ ] **Step 6: Проверить руками в dev-сервере**

Run: `pnpm dev` и открыть адрес из вывода.

Чеклист на десктопе:
1. Навести на «Audiogram»: карточка появляется у курсора справа, стартует из точки курсора, не из угла.
2. Поводить курсором по списку: карточка идёт за ним с небольшой задержкой, слегка наклоняется при быстром движении, не больше чем на несколько градусов.
3. Перейти на «lyra-audio»: кадр сменяется плашкой `npm i lyra-audio` в сиреневом тоне с подъёмом.
4. Увести курсор с списка: карточка гаснет за ~0.2с.
5. Сузить окно так, чтобы справа от курсора было меньше 300px: карточка встаёт слева от курсора.
6. Переключить язык: у Audiogram и TunA кадр меняется на другой язык.
7. DevTools → эмуляция тач-устройства (`iPhone`): карточки нет, список как раньше.
8. DevTools → Rendering → `prefers-reduced-motion: reduce`: карточка появляется без масштаба, наклона нет.

- [ ] **Step 7: Commit**

```bash
git add src/components/project-list src/pages/HomePage.vue
git commit -m "Show a cursor-following project preview card on the landing"
```

---

### Task 5: Счётчик в заголовке и страница `/projects`

**Files:**
- Modify: `src/router/route-names.ts`
- Modify: `src/router/route-locations.ts`
- Modify: `src/router/routes/pages.ts`
- Modify: `src/app/i18n/locales/ru/projects.json`, `src/app/i18n/locales/en/projects.json`
- Create: `src/pages/ProjectsPage.vue`
- Modify: `src/pages/HomePage.vue` (заголовок секции проектов)

**Interfaces:**
- Consumes: `ProjectShot` из `@/components/project-list`, `Button` из `@/components/ui/button`, `projects` из `@/data/projects`, `toPreviewLocale` из `@/components/project-list/preview`.
- Produces: `ROUTE_NAMES.PROJECTS`, `routeLocation.projects()`, ключ `projects.back`.

- [ ] **Step 1: Маршрут**

`src/router/route-names.ts`:

```ts
export const ROUTE_NAMES = {
  HOME: 'home',
  PROJECTS: 'projects',
} as const

export type AppRouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]
```

`src/router/route-locations.ts`:

```ts
import type { RouteLocationRaw } from 'vue-router'
import { ROUTE_NAMES } from '@/router/route-names'

export const routeLocation = {
  home: (): RouteLocationRaw => ({ name: ROUTE_NAMES.HOME }),
  projects: (): RouteLocationRaw => ({ name: ROUTE_NAMES.PROJECTS }),
} as const
```

`src/router/routes/pages.ts`: вставить запись перед редиректом `pathMatch`:

```ts
  {
    path: '/projects',
    name: ROUTE_NAMES.PROJECTS,
    component: () => import('@/pages/ProjectsPage.vue'),
  },
```

Комментарий над редиректом («Страница одна…») поправить на: `// Любой чужой адрес возвращает на главную, а не в пустой экран.`

- [ ] **Step 2: Локали**

В `src/app/i18n/locales/ru/projects.json` добавить после `"open"`:

```json
  "back": "На главную",
```

В `src/app/i18n/locales/en/projects.json` добавить после `"open"`:

```json
  "back": "Back home",
```

- [ ] **Step 3: Страница `ProjectsPage.vue`**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ProjectShot } from '@/components/project-list'
import { toPreviewLocale } from '@/components/project-list/preview'
import IconArrowBack from '~icons/material-symbols/arrow-back-rounded'
import IconArrowOutward from '~icons/material-symbols/arrow-outward-rounded'
import { projects } from '@/data/projects'
import { routeLocation } from '@/router/route-locations'

const { t, locale } = useI18n()

const counter = computed(() => t('projects.count', projects.length))
const previewLocale = computed(() => toPreviewLocale(locale.value))
</script>

<template>
  <div
    class="mx-auto flex w-full max-w-[var(--column)] flex-col gap-[var(--space-8)] px-[var(--space-6)] pt-[var(--space-12)] pb-[var(--space-20)]"
  >
    <Button :as="RouterLink" :to="routeLocation.home()" variant="ghost" size="sm" class="self-start">
      <IconArrowBack aria-hidden="true" />
      {{ t('projects.back') }}
    </Button>

    <header class="flex flex-col gap-[var(--space-3)]">
      <span class="t-label">{{ counter }} · {{ t('projects.range') }}</span>
      <h1 class="t-title m-0">{{ t('projects.title') }}</h1>
    </header>

    <div class="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2">
      <component
        :is="project.url ? 'a' : 'article'"
        v-for="project in projects"
        :key="project.slug"
        :href="project.url"
        :target="project.url ? '_blank' : undefined"
        :rel="project.url ? 'noopener noreferrer' : undefined"
        class="press-scale flex flex-col gap-[var(--space-3)] rounded-card p-[var(--space-3)] no-underline text-fg [transition:background-color_var(--dur-surface)_ease,transform_var(--dur-press)_var(--ease-standard)] hover:bg-sunk"
      >
        <div class="overflow-hidden rounded-3">
          <ProjectShot :project="project" :locale="previewLocale" />
        </div>

        <div class="flex flex-col gap-1 px-1">
          <div class="flex items-center gap-2">
            <span class="truncate text-[15.5px] font-semibold tracking-[-0.012em]">{{
              project.title
            }}</span>
            <span class="ms-auto t-label">{{ project.year }}</span>
            <IconArrowOutward
              v-if="project.url"
              class="size-5 shrink-0 text-faint"
              aria-hidden="true"
            />
          </div>
          <p class="t-small m-0">{{ t(project.captionKey) }}</p>
        </div>
      </component>
    </div>
  </div>
</template>
```

- [ ] **Step 4: Заголовок секции на главной**

В `src/pages/HomePage.vue` добавить импорты:

```ts
import { RouterLink } from 'vue-router'
import IconArrowForward from '~icons/material-symbols/arrow-forward-rounded'
import { routeLocation } from '@/router/route-locations'
```

Заголовок секции проектов из Task 4 заменить на строку-ссылку:

```vue
      <RouterLink
        :to="routeLocation.projects()"
        class="press-scale group -mx-[12px] flex min-h-[44px] items-center justify-between rounded-3 px-[12px] no-underline"
      >
        <h2
          class="m-0 flex items-center gap-1 text-[13.5px] font-semibold text-muted-foreground [transition:color_var(--dur-hover)_ease] group-hover:text-fg"
        >
          {{ t('projects.title') }}
          <IconArrowForward
            class="size-4 text-faint [transition:color_var(--dur-hover)_ease] group-hover:text-fg"
            aria-hidden="true"
          />
        </h2>
        <span class="t-label">{{ t('projects.count', projects.length) }}</span>
      </RouterLink>
```

Минус 12px по бокам повторяет то, как `ListRow` выходит за колонку, чтобы фон ховера у заголовка и у строк был одной ширины.

- [ ] **Step 5: Проверить типы, линт, тесты**

Run: `pnpm type-check && pnpm lint && pnpm test:run`
Expected: без ошибок.

- [ ] **Step 6: Проверить руками**

Run: `pnpm dev`.

1. На главной справа от «Проекты» стоит «4 проекта» (в en «4 projects»), вся строка подсвечивается на ховере, стрелка и текст темнеют.
2. Клик ведёт на `/projects`: сверху ссылка «На главную», лейбл «4 проекта · 2024—2025», заголовок «Проекты», сетка 2×2 карточек со скриншотами, у lyra-audio сиреневая плашка.
3. Сузить окно до телефона: одна колонка.
4. Клик по карточке открывает проект в новой вкладке, «На главную» возвращает на `/`.
5. Открыть `/anything`: редирект на главную по-прежнему работает.

- [ ] **Step 7: Commit**

```bash
git add src/router src/app/i18n/locales src/pages/ProjectsPage.vue src/pages/HomePage.vue
git commit -m "Add a project count to the landing heading and a /projects cards page"
```

---

### Task 6: Финальная проверка и сборка

**Files:** без изменений, кроме правок по результатам.

- [ ] **Step 1: Полный прогон**

Run: `pnpm lint && pnpm type-check && pnpm test:run && pnpm build`
Expected: всё зелёное, `dist/` собирается. Если `pnpm lint` что-то автоисправил (`--fix`), закоммитить это отдельным коммитом `Lint fixes`.

- [ ] **Step 2: Проверить размер картинок в сборке**

Run (Git Bash): `ls -la dist/projects/*/*.webp`
Expected: только WebP используются страницей; PNG лежат рядом, но не запрашиваются (проверить во вкладке Network при открытии карточки: запросы только на `.webp`).

- [ ] **Step 3: Сверить со спеком**

Пройти спек `docs/superpowers/specs/2026-09-03-project-cursor-preview-design.md` сверху вниз и отметить, что каждое поведение видно в dev-сервере. Отдельно: карточка не перехватывает клики (`pointer-events: none`), фокус с клавиатуры карточку не показывает (Tab по строкам — карточки нет).

- [ ] **Step 4: Commit правок, если были**

```bash
git add -A src
git commit -m "Polish the project preview after a manual pass"
```
