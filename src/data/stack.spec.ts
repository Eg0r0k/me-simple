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
