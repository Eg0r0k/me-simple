import { afterEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { PenStroke } from '.'

describe('PenStroke', () => {
  it('оборачивает текст и рисует один путь', () => {
    const wrapper = mount(PenStroke, { slots: { default: 'дня' } })
    const root = wrapper.get('span.pen-stroke')
    expect(root.text()).toBe('дня')
    expect(root.findAll('svg path')).toHaveLength(1)
    expect(root.get('svg').attributes('aria-hidden')).toBe('true')
  })

  it('без IntersectionObserver штрих показан сразу', () => {
    const wrapper = mount(PenStroke, { slots: { default: 'дня' } })
    expect(wrapper.get('span.pen-stroke').classes()).toContain('pen-stroke-drawn')
  })

  describe('с IntersectionObserver штрих ждёт появления в вьюпорте', () => {
    afterEach(() => vi.unstubAllGlobals())

    it('добавляет pen-stroke-drawn только после isIntersecting', async () => {
      let callback: IntersectionObserverCallback | undefined

      class IntersectionObserverStub {
        constructor(cb: IntersectionObserverCallback) {
          callback = cb
        }
        observe = vi.fn()
        unobserve = vi.fn()
        disconnect = vi.fn()
      }

      vi.stubGlobal('IntersectionObserver', IntersectionObserverStub)

      const wrapper = mount(PenStroke, { slots: { default: 'дня' } })
      await nextTick()

      const root = wrapper.get('span.pen-stroke')
      expect(root.classes()).not.toContain('pen-stroke-drawn')

      // @vueuse/core передаёт callback прямо в конструктор IntersectionObserver
      // и ждёт от записи поле time (иначе запись отбрасывается как устаревшая) —
      // без него класс не появится.
      callback!(
        [
          {
            isIntersecting: true,
            intersectionRatio: 1,
            target: root.element,
            time: performance.now(),
          } as IntersectionObserverEntry,
        ],
        new IntersectionObserverStub(() => {}) as unknown as IntersectionObserver,
      )
      await nextTick()

      expect(root.classes()).toContain('pen-stroke-drawn')
    })
  })
})
