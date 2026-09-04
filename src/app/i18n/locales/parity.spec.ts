import { describe, it, expect } from 'vitest'
import ru from './ru/index'
import en from './en/index'

function collectKeyPaths(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return [prefix]
  }
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    collectKeyPaths(child, prefix ? `${prefix}.${key}` : key),
  )
}

describe('locale parity', () => {
  it('ru и en содержат один и тот же набор ключей', () => {
    const ruKeys = collectKeyPaths(ru).sort()
    const enKeys = collectKeyPaths(en).sort()
    expect(ruKeys).toEqual(enKeys)
  })
})
