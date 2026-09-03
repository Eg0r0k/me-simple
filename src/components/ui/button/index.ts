import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'

const MOTION =
  '[transition:transform_var(--dur-press)_var(--ease-standard),background-color_var(--dur-hover)_ease,color_var(--dur-hover)_ease,filter_var(--dur-hover)_ease]'

export const buttonVariants = cva(
  [
    'press-scale inline-flex shrink-0 select-none items-center justify-center gap-[7px] whitespace-nowrap',
    'font-sans font-medium',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    'disabled:cursor-not-allowed disabled:bg-sunk disabled:text-faint disabled:hover:bg-sunk disabled:hover:filter-none',
    MOTION,
  ].join(' '),
  {
    variants: {
      size: {
        xs: "h-[26px] px-[10px] rounded-1 text-[12.5px] [&_svg:not([class*='size-'])]:size-[15px] has-[>svg:first-child]:ps-[7px] has-[>svg:last-child]:pe-[7px]",
        sm: "h-[32px] px-[12px] rounded-2 text-[13px] [&_svg:not([class*='size-'])]:size-[16px] has-[>svg:first-child]:ps-[9px] has-[>svg:last-child]:pe-[9px]",
        md: "h-[38px] px-[15px] rounded-3 text-[14px] [&_svg:not([class*='size-'])]:size-[18px] has-[>svg:first-child]:ps-[12px] has-[>svg:last-child]:pe-[12px]",
        lg: "h-[44px] px-[18px] rounded-4 text-[15px] [&_svg:not([class*='size-'])]:size-[20px] has-[>svg:first-child]:ps-[15px] has-[>svg:last-child]:pe-[15px]",
        xl: "h-[52px] px-[22px] rounded-5 text-[16px] [&_svg:not([class*='size-'])]:size-[22px] has-[>svg:first-child]:ps-[19px] has-[>svg:last-child]:pe-[19px]",
        'icon-xs': "size-[26px] p-0 rounded-1 [&_svg:not([class*='size-'])]:size-[15px]",
        'icon-sm': "size-[32px] p-0 rounded-2 [&_svg:not([class*='size-'])]:size-[16px]",
        icon: "size-[38px] p-0 rounded-3 [&_svg:not([class*='size-'])]:size-[18px]",
        'icon-lg': "size-[44px] p-0 rounded-4 [&_svg:not([class*='size-'])]:size-[20px]",
        'icon-xl': "size-[52px] p-0 rounded-5 [&_svg:not([class*='size-'])]:size-[22px]",
      },
      variant: {
        primary: 'bg-primary text-on-primary hover:brightness-[1.08]',
        secondary: 'bg-fill text-fg hover:bg-fill-hover',
        surface: 'bg-btn-surface text-on-btn-surface hover:bg-btn-surface-hover',
        ghost: 'bg-transparent text-muted-foreground hover:bg-fill hover:text-fg',
        destructive: 'bg-danger-soft text-danger-ink hover:brightness-[0.97]',
        link: 'h-[26px] bg-transparent p-0 text-fg underline decoration-peri decoration-2 underline-offset-4 hover:decoration-[3px]',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
