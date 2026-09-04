import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
  'inline-flex shrink-0 select-none items-center whitespace-nowrap font-sans font-medium [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      size: {
        sm: "h-5 rounded-xs px-1.75 text-[11.5px] gap-1 [&_svg:not([class*='size-'])]:size-3.25",
        md: "h-6 rounded-sm px-2 text-[12.5px] gap-1.25 [&_svg:not([class*='size-'])]:size-3.75",
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
      { size: 'sm', leading: true, class: 'ps-1.25' },
      { size: 'md', leading: true, class: 'ps-1.5' },
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
