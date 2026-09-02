<template>
  <div
    ref="windowRef"
    :style="adjustedStyle"
    class="absolute border border-foreground/30 bg-background min-w-[240px] min-h-[120px] overflow-hidden flex flex-col"
  >
    <div
      ref="toolbarRef"
      class="flex items-center justify-between px-2 py-1 select-none border-b border-foreground/30 text-[10px] tracking-[0.05em] uppercase font-bold"
      :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
    >
      <span><slot name="title" /></span>
      <button
        class="flex items-center justify-center size-4 hover:text-destructive transition-colors cursor-pointer"
        @click="$emit('close')"
      >
        ✕
      </button>
    </div>
    <Scrollable flow class="flex-1 min-h-0">
      <slot />
    </Scrollable>
    <div
      ref="resizeRef"
      class="absolute bottom-0 right-0 size-4 cursor-se-resize"
      @pointerdown.prevent="onResizeStart"
    >
      <svg viewBox="0 0 16 16" class="size-full opacity-40">
        <line x1="12" y1="4" x2="12" y2="12" stroke="currentColor" stroke-width="1.5" />
        <line x1="4" y1="12" x2="12" y2="12" stroke="currentColor" stroke-width="1.5" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { useDraggable, useEventListener } from '@vueuse/core'
import { Scrollable } from '@/components/ui/scrollable'

interface Props {
  initialX?: number
  initialY?: number
  initialW?: number
  initialH?: number
  zIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialX: 0,
  initialY: 0,
  initialW: 0,
  initialH: 0,
  zIndex: 10,
})

defineEmits<{
  close: []
}>()

const MIN_W = 240
const MIN_H = 120

const windowRef = useTemplateRef('windowRef')
const toolbarRef = useTemplateRef('toolbarRef')
const resizeRef = useTemplateRef('resizeRef')
const parentRef = computed(() => windowRef.value?.offsetParent as HTMLElement | null)

const { x, y, isDragging } = useDraggable(windowRef, {
  initialValue: { x: props.initialX, y: props.initialY },
  handle: toolbarRef,
  containerElement: parentRef,
  preventDefault: true,
})

const w = ref(props.initialW || 0)
const h = ref(props.initialH || 0)
const resizing = ref(false)

let startW = 0
let startH = 0
let startX = 0
let startY = 0

function onResizeStart(e: PointerEvent) {
  const el = windowRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  if (!w.value) w.value = rect.width
  if (!h.value) h.value = rect.height
  startW = w.value
  startH = h.value
  startX = e.clientX
  startY = e.clientY
  resizing.value = true
  e.preventDefault()
}

useEventListener('pointermove', (e) => {
  if (!resizing.value) return
  w.value = Math.max(MIN_W, startW + (e.clientX - startX))
  h.value = Math.max(MIN_H, startH + (e.clientY - startY))
})

useEventListener('pointerup', () => {
  resizing.value = false
})

const adjustedStyle = computed(() => ({
  transform: `translate(${x.value}px, ${y.value}px)`,
  left: '0',
  top: '0',
  width: w.value ? `${w.value}px` : undefined,
  height: h.value ? `${h.value}px` : undefined,
  zIndex: props.zIndex,
}))
</script>
