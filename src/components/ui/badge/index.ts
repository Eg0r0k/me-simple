import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
  'inline-flex shrink-0 select-none items-center whitespace-nowrap font-sans font-medium',
  {
    variants: {
      size: {
        sm: 'h-[20px] rounded-xs px-[7px] text-[11.5px] gap-[4px] [&_.ms]:text-[13px]',
        md: 'h-[24px] rounded-sm px-[8px] text-[12.5px] gap-[5px] [&_.ms]:text-[15px]',
      },
      tone: {
        primary: 'bg-primary text-on-primary',
        secondary: 'bg-fill text-fg',
        surface: 'bg-surface text-fg',
        ghost: 'bg-transparent text-muted-foreground',
        destructive: 'bg-danger-soft text-danger-ink',
        sky: 'bg-sky-soft text-sky-ink',
        peri: 'bg-peri-soft text-peri-ink',
        amber: 'bg-amber-soft text-amber-ink',
        mint: 'bg-mint-soft text-mint-ink',
        clay: 'bg-clay-soft text-clay-ink',
      },
      leading: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { size: 'sm', leading: true, class: 'ps-[5px]' },
      { size: 'md', leading: true, class: 'ps-[6px]' },
    ],
    defaultVariants: {
      size: 'md',
      tone: 'secondary',
      leading: false,
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
export type BadgeTone = NonNullable<BadgeVariants['tone']>
