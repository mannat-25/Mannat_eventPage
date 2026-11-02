'use client'

/**
 * Placeholder auth gate. Always allows access — frontend-only demo, no real auth.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
