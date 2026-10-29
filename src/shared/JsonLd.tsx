import type { ReactNode } from 'react'

export function JsonLd({ data }: { data: unknown }): ReactNode {
  const serialized = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json">{serialized}</script>
}
