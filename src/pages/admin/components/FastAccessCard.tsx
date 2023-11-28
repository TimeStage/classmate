import Link from 'next/link'
import { ReactNode } from 'react'

interface FastAccessCardProps {
  children: ReactNode
  href: string
}

export function FastAccessCard({ children, href }: FastAccessCardProps) {
  return (
    <Link
      href={href}
      className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border border-amber-500 bg-gray-950 p-8 text-xl font-bold text-gray-100 transition-all hover:opacity-70"
    >
      {children}
    </Link>
  )
}
