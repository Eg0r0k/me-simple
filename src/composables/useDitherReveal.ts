import { onBeforeUnmount, onMounted, readonly, ref, toValue, watch } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { getDitherRevealManager, type BlockOptions } from '@/lib/ditherRevealManager'

export function useDitherReveal(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: MaybeRefOrGetter<BlockOptions>,
) {
  const isPlaying = ref(false)
  const isDone = ref(false)

  const manager = getDitherRevealManager()
  const blockId = `dither-${crypto.randomUUID()}`
  const playsOnVisible = () => toValue(options).playOnVisible !== false

  let controls: ReturnType<typeof manager.register> | null = null
  let isRegistered = false

  function register() {
    const el = toValue(target)
    if (!el || isRegistered) return
    controls = manager.register(blockId, el, toValue(options))
    isRegistered = true
  }

  function unregister() {
    if (!isRegistered) return
    manager.unregister(blockId)
    controls = null
    isRegistered = false
  }

  let wasIntersecting = true

  const { pause, resume } = useIntersectionObserver(
    target,
    ([entry]) => {
      if (entry?.isIntersecting && !wasIntersecting && isDone.value) trigger()
      wasIntersecting = entry?.isIntersecting ?? false
    },
    { threshold: 0.2, rootMargin: '50px', immediate: playsOnVisible() },
  )

  function onDone() {
    isPlaying.value = false
    isDone.value = true
    resume()
  }

  function trigger() {
    if (!controls) return
    pause()
    isPlaying.value = true
    isDone.value = false
    controls.play(onDone)
  }

  onMounted(() => {
    register()
    trigger()
  })

  onBeforeUnmount(unregister)

  watch(
    () => toValue(options).src,
    (src, prevSrc) => {
      if (!isRegistered || src === prevSrc) return
      unregister()
      isPlaying.value = false
      isDone.value = false
      register()
      playsOnVisible() ? resume() : trigger()
    },
  )

  return {
    isPlaying: readonly(isPlaying),
    isDone: readonly(isDone),
    play: trigger,
    replay: trigger,
  }
}
