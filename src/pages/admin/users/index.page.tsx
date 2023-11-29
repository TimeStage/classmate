import { Button } from '@/components/Button'
import { prisma } from '@/lib/prisma'
import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import { updateUserRole } from '@/services/api/requests/put'
import { Role, User } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { ArrowCircleDown, ArrowCircleUp } from 'phosphor-react'
import { useState } from 'react'
import { toast } from 'react-toastify'

interface UsersPageProps {
  users: User[]
  user: User
}

export default function UsersPage({ user, users: serverUsers }: UsersPageProps) {

  const [users, setUsers] = useState<User[]>(serverUsers ?? [])

  async function updateUser(userId: string, role: Role, index:number) {
    try {
      const user = await updateUserRole({
        userId,role
      })

      setUsers(state=> {
        const tempState = [...state]

        tempState[index].role = user.role
        return tempState
      })

      toast.success("Cargo alterado com sucesso")
      
      
    } catch (error) {
      console.error(error)
      toast.error("ocorreu um erro a alterar o cargo do usuário!")
    }
  }

  return (
    <main className="flex max-w-[100vw] flex-col gap-10 overflow-hidden py-10 md:m-auto md:max-w-lg">
      <div className="flex flex-col gap-10">
        <h1 className="text-3xl font-bold text-gray-100 max-sm:text-center">
          Usuários
        </h1>
        <div className="flex w-full flex-col gap-6">
          {users.map((user, i) => (
            <div
              className="flex items-center justify-between rounded-md bg-amber-500 px-10 py-4 text-gray-100 "
              key={user.id}
            >
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-xl">{user.role}</p>
              <div className='flex justify-center items-center gap-1'>
              <Button onClick={()=> {
                updateUser(user.id, Role['ADMIN'], i)
              }} className='w-fit bg-green-500'>
                <ArrowCircleUp size={24} className='text-gray-100' />
              </Button>
              <Button
              onClick={()=> {
                updateUser(user.id, Role['STUDENT'], i)
              }}
              className='w-fit bg-red-500'>
                <ArrowCircleDown size={24} className='text-gray-100' />
              </Button>
              </div>
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
