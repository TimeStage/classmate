import React, { useEffect, useState } from 'react'
import {
  SignOut,
  House,
  UsersFour,
  Gear,
  List,
  ChalkboardTeacher,
} from 'phosphor-react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Role } from '@prisma/client'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const { pathname, push } = useRouter()

  const { data: session } = useSession()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const buttonClassName =
    'flex gap-2 items-center text-gray-100 font-bold text-xl cursor-pointer hover:opacity-70 transition-all'

  return (
    <>
      <button
        className={`fixed left-5 top-5 z-20 text-white md:hidden ${
          pathname === '/' && 'hidden'
        }`}
        onClick={() => setIsOpen((state) => !state)}
      >
        <List size={40} />
      </button>
      <aside
        className={`fixed left-0 top-0 z-10 h-screen w-full transform bg-gray-800 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }  md:flex md:h-fit md:w-full md:translate-x-0 md:justify-between md:bg-transparent md:px-9 md:py-4 ${
          pathname === '/' && 'opacity-0'
        }`}
      >
        <Link
          href={`/home`}
          className="hidden text-2xl font-bold text-gray-100 md:flex"
        >
          CEDUP Class
        </Link>
        <nav className="mt-32 flex  flex-col items-start justify-center gap-10 ps-14 md:mt-0 md:flex-row md:ps-0">
          {session?.user.role !== Role.ADMIN && (
            <Link href={`/home`} className={buttonClassName}>
              <House size={24} />
              <span>Sua turma</span>
            </Link>
          )}

          <Link href={`/team`} className={buttonClassName}>
            <UsersFour size={24} />
            <span>Pesquisar por turma</span>
          </Link>

          {session?.user.role === Role.ADMIN && (
            <Link href={`/admin`} className={buttonClassName}>
              <ChalkboardTeacher size={24} />
              <span>Painel do administrador</span>
            </Link>
          )}

          <Link href={`/config`} className={buttonClassName}>
            <Gear size={24} />
            <span>Configurações</span>
          </Link>
          <button
            onClick={async () => {
              await signOut()
              await push('/')
            }}
            className={buttonClassName}
          >
            <SignOut size={24} />
            <span>Sair</span>
          </button>
        </nav>
      </aside>
    </>
  )
}
