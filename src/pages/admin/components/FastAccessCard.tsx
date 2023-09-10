import { ReactNode } from 'react'

interface FastAccessCardProps {
  children: ReactNode
}

export function FastAccessCard({ children }: FastAccessCardProps) {
  return <div className="flex flex-col bg-slate-900 ">{children}</div>
}
