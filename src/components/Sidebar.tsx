import React, { ReactNode } from 'react'
import { XCircle, SignOut, House, UsersFour, Gear } from 'phosphor-react'

interface SidebarProps {
  isOpen: boolean
  children: ReactNode
  toggleSidebar: () => void
}

export function Sidebar({ isOpen, toggleSidebar, children }: SidebarProps) {
  const sidebarItems = [
    {
      icon: <House size={24} />,
      content: 'Sua turma',
    },
    {
      icon: <UsersFour size={24} />,
      content: 'Pesquisar por turma',
    },
    {
      icon: <SignOut size={24} />,
      content: 'Sair',
    },
    {
      icon: <Gear size={24} />,
      content: 'Configurações',
    },
  ]

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-800 w-64 transition-transform ease-in-out duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4">
        <button className="text-white" onClick={toggleSidebar}>
          <XCircle size={24} />
        </button>
      </div>
      <nav className="flex flex-col gap-4 items-start justify-center">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className="flex text-white ml-10 mb-4 cursor-pointer"
          >
            {item.icon}
            <span className="ml-2">{item.content}</span>
          </div>
        ))}
      </nav>
      {children}
    </aside>
  )
}
