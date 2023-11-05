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
        className={`fixed top-5 left-5 md:hidden text-white z-20 ${
          pathname === '/' && 'hidden'
        }`}
        onClick={() => setIsOpen((state) => !state)}
      >
        <List size={40} />
      </button>
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-800 w-full transition-transform ease-in-out duration-300 transform z-10 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }  md:h-fit md:translate-x-0 md:bg-transparent md:flex md:w-full md:justify-between md:py-4 md:px-9`}
      >
        <Link
          href={`/home`}
          className="hidden font-bold text-2xl text-gray-100 md:flex"
        >
          CEDUP Class
        </Link>
        <nav className="flex flex-col  mt-32 gap-10 ps-14 items-start justify-center md:flex-row md:ps-0 md:mt-0">
          <Link href={`/home`} className={buttonClassName}>
            <House size={24} />
            <span>Sua turma</span>
          </Link>
          <Link href={`/team`} className={buttonClassName}>
            <UsersFour size={24} />
            <span>Pesquisar por turma</span>
          </Link>

          {session?.user.role === 'ADMIN' && (
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
