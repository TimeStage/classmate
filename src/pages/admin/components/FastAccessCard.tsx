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
      className="flex flex-col bg-gray-950 text-gray-100 p-8 font-bold text-xl justify-center items-center gap-4 rounded-xl border transition-all border-amber-500 hover:opacity-70 cursor-pointer"
    >
      {children}
    </Link>
  )
}
