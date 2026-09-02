import { useBreakpoints } from '@vueuse/core'
import { computed } from 'vue'

/** Портировано из Audiogram (src/composables/useDeviceLayout.ts). */
const breakpoints = useBreakpoints({ tablet: 1024 })

export type LayoutType = 'desktop' | 'mobile'

export function useDeviceLayout() {
  const isMobileLayout = breakpoints.smaller('tablet')
  const isDesktopLayout = breakpoints.greaterOrEqual('tablet')

  const layoutType = computed<LayoutType>(() => (isMobileLayout.value ? 'mobile' : 'desktop'))

  return { layoutType, isMobileLayout, isDesktopLayout } as const
}
