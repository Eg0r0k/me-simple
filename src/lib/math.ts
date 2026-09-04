export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export const roundTo = (value: number, digits = 4) => {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}
