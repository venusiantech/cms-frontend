import { ReactNode } from 'react'

/** Layout for post folder. When used inside ArclightTemplate, only children are rendered (no app layout). */
export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
