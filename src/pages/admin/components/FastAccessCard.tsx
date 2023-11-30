import Link from 'next/link'
import { ComponentProps, ReactNode } from 'react'

interface FastAccessCardProps extends ComponentProps<typeof Link> {
  children: ReactNode
}

export function FastAccessCard({
  children,
  href,
  className,
  ...props
}: FastAccessCardProps) {
  return (
    <Link
      href={href}
      {...props}
      className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border border-amber-500 bg-gray-950 p-8 text-xl font-bold text-gray-100 transition-all hover:opacity-70 ${className}`}
    >
      {children}
    </Link>
  )
}
