import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'

const MOTION =
  '[transition:transform_var(--dur-press)_var(--ease-standard),background-color_var(--dur-hover)_ease,color_var(--dur-hover)_ease,filter_var(--dur-hover)_ease]'

export const buttonVariants = cva(
  [
    'press-scale inline-flex shrink-0 select-none items-center justify-center gap-1.75 whitespace-nowrap',
    'font-sans font-medium',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    'disabled:cursor-not-allowed disabled:bg-sunk disabled:text-faint disabled:hover:bg-sunk disabled:hover:filter-none',
    MOTION,
  ].join(' '),
  {
    variants: {
      size: {
        xs: "h-6.5 px-2.5 rounded-1 text-[12.5px] [&_svg:not([class*='size-'])]:size-3.75 has-[>svg:first-child]:ps-1.75 has-[>svg:last-child]:pe-1.75",
        sm: "h-8 px-3 rounded-2 text-[13px] [&_svg:not([class*='size-'])]:size-4 has-[>svg:first-child]:ps-2.25 has-[>svg:last-child]:pe-2.25",
        md: "h-9.5 px-3.75 rounded-3 text-[14px] [&_svg:not([class*='size-'])]:size-4.5 has-[>svg:first-child]:ps-3 has-[>svg:last-child]:pe-3",
        lg: "h-11 px-4.5 rounded-4 text-[15px] [&_svg:not([class*='size-'])]:size-5 has-[>svg:first-child]:ps-3.75 has-[>svg:last-child]:pe-3.75",
        xl: "h-13 px-5.5 rounded-5 text-[16px] [&_svg:not([class*='size-'])]:size-5.5 has-[>svg:first-child]:ps-4.75 has-[>svg:last-child]:pe-4.75",
        'icon-xs': "size-6.5 p-0 rounded-1 [&_svg:not([class*='size-'])]:size-3.75",
        'icon-sm': "size-8 p-0 rounded-2 [&_svg:not([class*='size-'])]:size-4",
        icon: "size-9.5 p-0 rounded-3 [&_svg:not([class*='size-'])]:size-4.5",
        'icon-lg': "size-11 p-0 rounded-4 [&_svg:not([class*='size-'])]:size-5",
        'icon-xl': "size-13 p-0 rounded-5 [&_svg:not([class*='size-'])]:size-5.5",
      },
      variant: {
        primary: 'bg-primary text-on-primary hover:brightness-[1.08]',
        secondary: 'bg-fill text-fg hover:bg-fill-hover',
        surface: 'bg-btn-surface text-on-btn-surface hover:bg-btn-surface-hover',
        ghost: 'bg-transparent text-muted-foreground hover:bg-fill hover:text-fg',
        destructive: 'bg-danger-soft text-danger-ink hover:brightness-[0.97]',
        link: 'h-6.5 bg-transparent p-0 text-fg underline decoration-peri decoration-2 underline-offset-4 hover:decoration-[3px]',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
