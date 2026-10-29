const configuredSiteUrl = import.meta.env.VITE_SITE_URL?.replace(/\/+$/, '')

export function absoluteSiteUrl(path: string) {
  const origin = configuredSiteUrl || (typeof window === 'undefined' ? '' : window.location.origin)
  if (!origin) return path
  return new URL(path, `${origin}/`).href
}
