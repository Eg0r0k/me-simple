<template>
  <div :class="wrapperClasses">
    <div
      v-if="showThumbVisible"
      class="scrollable-thumb-container"
      :class="direction === 'horizontal' ? 'scrollable-thumb-container-x' : 'scrollable-thumb-container-y'"
    >
      <div
        ref="thumbRef"
        class="scrollable-thumb"
        :class="{ 'is-focused': isDragging }"
        :style="thumbStyle"
        @mousedown="handleThumbMouseDown"
      />
    </div>

    <div
      ref="containerRef"
      :class="containerClasses"
      @scroll="handleScrollEmit"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, useTemplateRef } from "vue";
import useScrollable from "./useScrollable";

interface Props {
  direction?: "vertical" | "horizontal";
  onScrollOffset?: number;
  bordered?: boolean;
  hideThumb?: boolean;
  /**
   * Keep the scroll container in normal flow instead of `position: absolute`.
   * Lets a parent without an explicit height (e.g. an auto-sized window) grow
   * from the content; once the parent gets a fixed height the content scrolls.
   */
  flow?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  direction: "vertical",
  onScrollOffset: 300,
  bordered: false,
  hideThumb: false,
  flow: false,
});

const emit = defineEmits<{
  scroll: [event: Event];
  scrolledTop: [];
  scrolledBottom: [];
}>();

const containerRef = useTemplateRef("containerRef");

const {
  isDragging,
  thumbSize,
  thumbPosition,
  handleThumbMouseDown,
  updateThumb,
  scrollTo,
  scrollToEnd,
  scrollToStart,
  scrollPosition,
  isScrolledToEnd,
  isScrolledToStart,
  USE_OWN_SCROLL,
} = useScrollable(containerRef, {
  direction: props.direction,
  onScrollOffset: props.onScrollOffset,
  onScrolledTop: () => emit("scrolledTop"),
  onScrolledBottom: () => emit("scrolledBottom"),
});

function handleScrollEmit(e: Event) {
  emit("scroll", e);
  updateThumb();
}

const wrapperClasses = computed(() => [
  "scrollable-wrapper",
  props.direction === "vertical" ? "scrollable-direction-y" : "scrollable-direction-x",
  {
    "scrollable-flow": props.flow,
    "scrollable-y-bordered": props.bordered && props.direction === "vertical",
    "scrolled-start": props.bordered && isScrolledToStart.value,
    "scrolled-end": props.bordered && isScrolledToEnd.value,
  },
]);

const containerClasses = computed(() => [
  "scrollable",
  props.direction === "vertical" ? "scrollable-y" : "scrollable-x",
  { "no-scrollbar": true },
]);

const showThumbVisible = computed(() => !props.hideThumb && thumbSize.value > 0);

const thumbStyle = computed(() => {
  if (props.direction === "vertical") {
    return {
      height: `${thumbSize.value}px`,
      transform: `translateY(${thumbPosition.value}px)`,
    };
  }
  return {
    width: `${thumbSize.value}px`,
    transform: `translateX(${thumbPosition.value}px)`,
  };
});

provide("scrollable", { scrollTo, scrollToEnd, scrollToStart, scrollPosition, isScrolledToEnd, isScrolledToStart, containerRef, USE_OWN_SCROLL });

defineExpose({
  scrollTo,
  scrollToEnd,
  scrollToStart,
  scrollPosition,
  isScrolledToEnd,
  isScrolledToStart,
  container: containerRef,
  USE_OWN_SCROLL,
});
</script>

<style>
.scrollable-wrapper {
  position: relative;
  overflow: hidden !important;
  width: 100%;
}
.scrollable-direction-y {
  height: 100%;
}
.scrollable-direction-x {
  height: auto;
}

.scrollable {
  width: 100%;
  height: 100%;
  max-height: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
  position: absolute;
  inset: 0;
  -webkit-overflow-scrolling: touch;
}

.scrollable::-webkit-scrollbar {
  width: 0;
  height: 0;
  opacity: 0;
}

.scrollable::-webkit-scrollbar-thumb {
  opacity: 0;
  transition: 0.2s ease-in-out;
}

.scrollable::-webkit-scrollbar-button {
  width: 0;
  height: 0;
  display: none;
}

.scrollable::-webkit-scrollbar-corner {
  background-color: transparent;
}

.scrollable-y {
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
  overscroll-behavior-y: contain;
}

/* flow mode: the container sizes from content until the parent constrains it */
.scrollable-flow > .scrollable {
  position: relative;
  inset: auto;
  height: 100%;
}

.scrollable-x {
  position: relative;
  inset: auto;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  overscroll-behavior-x: contain;
  white-space: nowrap;
}

.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollable-x::-webkit-scrollbar,
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Thumb */
.scrollable-thumb-container {
  position: sticky;
  top: 0;
  z-index: 20;
  pointer-events: none;
  height: 0;
  width: 0;
}

.scrollable-thumb-container-y {
  float: right;
  margin-right: 1px;
}

.scrollable-thumb-container-x {
  left: 0;
  right: 0;
  bottom: 2px;
  height: 6px;
}

.scrollable-thumb {
  position: absolute;
  /* Square, no radius; foreground mixed like the project's borders, a bit denser to stay findable. */
  border-radius: 0;
  background: color-mix(in oklch, var(--color-foreground) 45%, transparent);
  pointer-events: auto;
  cursor: default;
  opacity: 0;
  transition:
    opacity 0.1s ease-in-out,
    background-color 0.1s ease-in-out;
}

.scrollable-thumb-container-y .scrollable-thumb {
  top: 0;
  right: 0;
  width: 4px;
}

.scrollable-thumb-container-x .scrollable-thumb {
  left: 0;
  bottom: 0;
  height: 4px;
}

.scrollable-wrapper:hover .scrollable-thumb,
.scrollable-thumb.is-focused {
  opacity: 1;
}

.scrollable-thumb:hover {
  background: color-mix(in oklch, var(--color-foreground) 70%, transparent);
}

.scrollable-thumb.is-focused {
  background: var(--color-foreground);
}
</style>
