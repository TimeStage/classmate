import { ReactNode } from 'react'
import { Sidebar } from '../Sidebar'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Sidebar />
      <main className="bg-zinc-900 min-h-screen h-full min-w-max font-roboto px-8 py-24">
        {children}
      </main>
    </>
  )
}
