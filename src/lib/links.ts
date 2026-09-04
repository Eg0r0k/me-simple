export function externalLinkAttrs(url?: string) {
  if (!url) return {}
  return { href: url, target: '_blank', rel: 'noopener noreferrer' } as const
}
