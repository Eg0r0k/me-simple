import type { Component } from 'vue'

import AccountTree from '~icons/material-symbols/account-tree-rounded'
import Add from '~icons/material-symbols/add-rounded'
import ArrowForward from '~icons/material-symbols/arrow-forward-rounded'
import ArrowOutward from '~icons/material-symbols/arrow-outward-rounded'
import CalendarMonth from '~icons/material-symbols/calendar-month-rounded'
import Category from '~icons/material-symbols/category-rounded'
import Check from '~icons/material-symbols/check-rounded'
import ChevronRight from '~icons/material-symbols/chevron-right-rounded'
import Code from '~icons/material-symbols/code-rounded'
import DarkMode from '~icons/material-symbols/dark-mode-rounded'
import DeployedCode from '~icons/material-symbols/deployed-code-rounded'
import Draw from '~icons/material-symbols/draw-rounded'
import ExpandMore from '~icons/material-symbols/expand-more-rounded'
import FiberManualRecord from '~icons/material-symbols/fiber-manual-record-rounded'
import GraphicEq from '~icons/material-symbols/graphic-eq-rounded'
import Image from '~icons/material-symbols/image-rounded'
import LightMode from '~icons/material-symbols/light-mode-rounded'
import Mail from '~icons/material-symbols/mail-rounded'
import Person from '~icons/material-symbols/person-rounded'
import Terminal from '~icons/material-symbols/terminal-rounded'
import Translate from '~icons/material-symbols/translate-rounded'

export const icons = {
  account_tree: AccountTree,
  add: Add,
  arrow_forward: ArrowForward,
  arrow_outward: ArrowOutward,
  calendar_month: CalendarMonth,
  category: Category,
  check: Check,
  chevron_right: ChevronRight,
  code: Code,
  dark_mode: DarkMode,
  deployed_code: DeployedCode,
  draw: Draw,
  expand_more: ExpandMore,
  fiber_manual_record: FiberManualRecord,
  graphic_eq: GraphicEq,
  image: Image,
  light_mode: LightMode,
  mail: Mail,
  person: Person,
  terminal: Terminal,
  translate: Translate,
} satisfies Record<string, Component>

export type IconName = keyof typeof icons
