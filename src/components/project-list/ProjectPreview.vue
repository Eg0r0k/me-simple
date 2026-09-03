<script setup lang="ts">
import { computed, watch } from 'vue'
import type { MotionValue } from 'motion-v'
import { motion, useSpring, useTransform, useVelocity } from 'motion-v'
import { usePreferredReducedMotion, useWindowSize } from '@vueuse/core'
import type { PreviewLocale, Project } from '@/data/projects'
import {
  CARD_HEIGHT,
  CARD_OFFSET,
  CARD_WIDTH,
  VIEWPORT_MARGIN,
  clampCardY,
  clampTilt,
  placeCard,
} from './preview'
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
const { width: viewportWidth, height: viewportHeight } = useWindowSize({ includeScrollbar: false })

// Пружины идут за курсором; motion values обновляют DOM мимо рендера Vue.
const x = useSpring(props.pointerX, FOLLOW)
const y = useSpring(props.pointerY, FOLLOW)

// getVelocity() сам по себе не подписывает useTransform: он не помечает себя как
// прочитанный motion value, только get(). useVelocity(x) — отдельный motion value,
// который сам обновляется каждый кадр и корректно триггерит tiltTarget.
const xVelocity = useVelocity(x)
// Наклон из скорости пружины по x, сам тоже через пружину, чтобы не дёргался.
const tiltTarget = useTransform(() => (noMotion.value ? 0 : clampTilt(xVelocity.get())))
const rotate = useSpring(tiltTarget, TILT)

// Сторона считается от текущего положения пружины: карточка перекидывается влево
// без анимации, когда её правый край упирается в поле окна. Левая ветка сама
// не даёт карточке уйти за левый край окна.
// При reduced motion пружины не выключаются (useSpring не слушает MotionConfig),
// поэтому здесь читаем сырые координаты курсора вместо x.get()/y.get() — тогда
// карточка следует за курсором без задержки. useTransform пересобирает подписки
// при каждом пересчёте, так что переключение noMotion подхватывается сразу.
const translateX = useTransform(() => {
  const px = noMotion.value ? props.pointerX.get() : x.get()
  return placeCard(px, CARD_WIDTH, viewportWidth.value) === 'right'
    ? px + CARD_OFFSET
    : Math.max(VIEWPORT_MARGIN, px - CARD_OFFSET - CARD_WIDTH)
})
const translateY = useTransform(() => {
  const py = noMotion.value ? props.pointerY.get() : y.get()
  return clampCardY(py, CARD_HEIGHT, viewportHeight.value)
})

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
    class="pointer-events-none fixed top-0 left-0 z-30 overflow-hidden rounded-3 bg-sunk shadow-2"
    :style="{ x: translateX, y: translateY, rotate, width: `${CARD_WIDTH}px` }"
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
