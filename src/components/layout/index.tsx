import { ReactNode } from 'react'
import { Sidebar } from '../Sidebar'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Sidebar />
      <main className="h-full min-h-screen min-w-max bg-zinc-900 px-8 py-24 font-roboto">
        {children}
      </main>
    </>
  )
}
