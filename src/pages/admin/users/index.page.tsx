import { prisma } from '@/lib/prisma'
import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import { User } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'

interface UsersPageProps {
  users: User[]
  user: User
}

export default function UsersPage({ user, users }: UsersPageProps) {
  return (
    <main className="flex max-w-[100vw] flex-col gap-10 overflow-hidden py-10 md:m-auto md:max-w-lg">
      <div className="flex flex-col gap-10">
        <h1 className="text-3xl font-bold text-gray-100 max-sm:text-center">
          Usuários
        </h1>
        <div className="flex w-full flex-col gap-6">
          {users.map((user) => (
            <div
              className="flex items-center justify-between rounded-md bg-amber-500 px-10 py-4 text-gray-100 "
              key={user.id}
            >
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-xl">{user.role}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )
  if (session?.user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/home',
      },
      props: {},
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  })

  const users = await prisma.user.findMany()

  return {
    props: {
      users,
      user,
    },
  }
}
