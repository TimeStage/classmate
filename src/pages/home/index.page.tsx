import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { roboto } from '@/lib/fonts/roboto'
import { AccordionDemo } from '@/components/Accordion'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/Button'
import { buildNextAuthOptions } from '../api/auth/[...nextauth].api'
import { FileArrowDown, List } from 'phosphor-react'
import { useState } from 'react'

export default function Home() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)

  function toggleSidebar() {
    setIsSideBarOpen(!isSideBarOpen)
  }

  return (
    <div
      className={`bg-zinc-900 w-screen h-screen flex flex-col justify-center items-center gap-16 px-8 ${roboto.className} `}
    >
      <button
        className="absolute top-2 left-2 text-white"
        onClick={toggleSidebar}
      >
        <List size={24} />
      </button>
      <Sidebar isOpen={isSideBarOpen} toggleSidebar={toggleSidebar}></Sidebar>
      <div className="flex flex-col max-w-xl w-full gap-6 text-gray-100">
        <h1 className="font-bold text-2xl">Olá Davi Marcilio</h1>
        <p className="font-semibold text-base">Aqui estão suas aulas!</p>
      </div>
      <main className="flex flex-col justify-center items-center w-full">
        <div className="flex justify-center items-center flex-col gap-5 max-w-xl w-full">
          <AccordionDemo />
          <Button className="bg-amber-500 w-80">
            Baixar Aulas <FileArrowDown size={18} />
          </Button>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session?.user || !session.user.email) {
    return {
      props: {},
      redirect: {
        destination: '/',
      },
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  })

  if (!user) {
    return {
      props: {},
      redirect: {
        destination: '/',
      },
    }
  }

  if (!user.teamId) {
    return {
      props: {},
      redirect: {
        destination: '/register/form-step',
      },
    }
  }

  return {
    props: { user: session.user },
  }
}
