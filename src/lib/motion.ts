export const EASE: [number, number, number, number] = [0.2, 0, 0.2, 1]

export const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: EASE },
})

export const reveal = () => ({
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  inViewOptions: { once: true },
  transition: { duration: 0.5, ease: EASE },
})
