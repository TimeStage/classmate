import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { Button } from '@/components/Button'
import { buildNextAuthOptions } from '../api/auth/[...nextauth].api'
import { FileArrowDown } from 'phosphor-react'
import { Accordion } from '@/components/Accordion'
import { TeamClasses } from '@/components/TeamClasses'

const teamClasses = [
  {
    id: 'dashnjkdasn',
    hour: new Date(Math.random() * 1000),
    class: 'História',
  },
  {
    id: 'randomUUID().tdsadasoString()',
    hour: new Date(Math.random() * 1000),
    class: 'Fisica',
  },
  {
    id: 'dsad2312as',
    hour: new Date(Math.random() * 1000),
    class: 'Português',
  },
  {
    id: 'dsaddsadasazxczczxs',
    hour: new Date(Math.random() * 1000),
    class: 'Matematica',
  },
  {
    id: 'dsahgfhfgdas',
    hour: new Date(Math.random() * 1000),
    class: 'História',
  },
]

const weekDays = [
  {
    title: 'Segunda feira',
    value: 'segunda',
    content: <TeamClasses classes={teamClasses} />,
  },
  {
    title: 'terça feira',
    value: 'terça',
    content: (
      <>
        <h1>teste</h1>{' '}
      </>
    ),
  },
  {
    title: 'quarta feira',
    value: 'quarta',
    content: (
      <>
        <h1>teste</h1>{' '}
      </>
    ),
  },
  {
    title: 'quinta feira',
    value: 'quinta',
    content: (
      <>
        {' '}
        <h1>teste</h1> <h1>teste</h1> <h1>teste</h1> <h1>teste</h1>{' '}
        <h1>teste</h1> <h1>teste</h1> <h1>teste</h1> <h1>teste</h1>{' '}
        <h1>teste</h1> <h1>teste</h1> <h1>teste</h1> <h1>teste</h1>{' '}
      </>
    ),
  },
  {
    title: 'sexta feira',
    value: 'sexta',
    content: (
      <>
        <h1>teste</h1>{' '}
      </>
    ),
  },
]

export default function Home() {
  return (
    <div
      className={`bg-zinc-900 w-full min-h-screen h-full flex flex-col justify-start py-24 items-center gap-8 px-8 font-roboto`}
    >
      <div className="flex flex-col max-w-xl w-full gap-6 text-gray-100">
        <h1 className="font-bold text-2xl">Olá Davi Marcilio</h1>
        <p className="font-semibold text-base">Aqui estão suas aulas!</p>
      </div>
      <main className="flex flex-col justify-center items-center w-full">
        <div className="flex justify-center items-center flex-col gap-5 max-w-xl w-full">
          <Accordion contents={weekDays} />
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
