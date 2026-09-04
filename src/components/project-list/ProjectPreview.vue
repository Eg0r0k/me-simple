<script setup lang="ts">
import { computed, watch } from 'vue'
import type { MotionValue } from 'motion-v'
import { motion, useSpring, useTransform, useVelocity } from 'motion-v'
import { usePreferredReducedMotion, useWindowSize } from '@vueuse/core'
import type { PreviewLocale, Project } from '@/data/projects'
import { EASE } from '@/lib/motion'
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

const FOLLOW = { stiffness: 400, damping: 40, mass: 1 }
const TILT = { stiffness: 200, damping: 30 }

const reduced = usePreferredReducedMotion()
const noMotion = computed(() => reduced.value === 'reduce')
const { width: viewportWidth, height: viewportHeight } = useWindowSize({ includeScrollbar: false })

const x = useSpring(props.pointerX, FOLLOW)
const y = useSpring(props.pointerY, FOLLOW)

// useVelocity, а не x.getVelocity(): последний не подписывает useTransform на обновления.
const xVelocity = useVelocity(x)
const tiltTarget = useTransform(() => (noMotion.value ? 0 : clampTilt(xVelocity.get())))
const rotate = useSpring(tiltTarget, TILT)

// useSpring не слушает MotionConfig, при reduced motion берём курсор напрямую.
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
