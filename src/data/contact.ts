import IconSend from '~icons/material-symbols/send-rounded'
import IconCode from '~icons/material-symbols/code-rounded'
import IconMail from '~icons/material-symbols/mail-rounded'

export const EMAIL = 'lambdawork1n@gmail.com'
export const MAILTO = `mailto:${EMAIL}`

export const links = [
  { id: 'telegram', icon: IconSend, url: 'https://t.me/EG0RK13', handle: '@EG0RK13' },
  { id: 'github', icon: IconCode, url: 'https://github.com/Eg0r0k', handle: 'Eg0r0k' },
  { id: 'email', icon: IconMail, url: MAILTO, handle: EMAIL },
] as const
