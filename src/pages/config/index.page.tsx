import { Select } from '@/components/Select'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { Bug, PencilSimpleLine } from 'phosphor-react'
import { buildNextAuthOptions } from '../api/auth/[...nextauth].api'
import { Course, Team, User } from '@prisma/client'
import { Button } from '@/components/Button'
import { useState } from 'react'
import { updateUser } from '@/services/api/requests/patch'
import { toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'
import { teamsGetByCourse } from '@/services/api/requests/get'
import { FormInputCourse } from './components/FormInputCourse'
import { FormInputName } from './components/FormInputName'
import { FormInputTeam } from './components/FormInputTeam'

interface ConfigProps {
  user: User
  courses: Course[]
  userTeam: Team | null
}

export interface EditableOptionsProps {
  name: string
  courseId: string
  teamId: string
}

export default function Config({
  courses,
  user,
  userTeam: userTeamFromServer,
}: ConfigProps) {
  const [editableOptions, setEditableOptions] = useState(
    {} as EditableOptionsProps,
  )
  const [isFetching, setIsFetching] = useState(false)
  const [userTeam, setUserTeam] = useState(userTeamFromServer)
  const { data: teams, isFetching: localTeamsFetching } = useQuery(
    ['teams', editableOptions.courseId ?? userTeam?.courseId],
    async () => {
      if (editableOptions.courseId && userTeam?.courseId) {
        const teams = await teamsGetByCourse({
          courseId: editableOptions.courseId
            ? editableOptions.courseId
            : userTeam.courseId,
        })

        return teams
      }
      return undefined
    },
  )

  async function handleUpdateUser(
    infoToUpdate: keyof EditableOptionsProps,
    editableOptions: EditableOptionsProps,
  ) {
    try {
      setIsFetching(true)
      await updateUser({
        [infoToUpdate]: editableOptions[infoToUpdate],
      })
      toast.success('Informação do usuário atualizado com sucesso!')
      setEditableOptions((state) => {
        return {
          ...state,
          [infoToUpdate]: '',
        }
      })
    } catch (error) {
      console.error(error)
      toast.error('Erro ao atualizar informações do usuário')
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <main className="flex flex-col gap-6 w-full">
      <h2 className="text-stone-400 text-xl">Informações pessoais</h2>
      <FormInputName
        user={user}
        editableOptions={editableOptions}
        isLoading={isFetching}
        setEditableOptions={setEditableOptions}
        handleUpdateUser={handleUpdateUser}
      />
      <FormInputCourse
        courses={courses}
        editableOptions={editableOptions}
        isLoading={isFetching}
        userTeam={userTeam}
        setEditableOptions={setEditableOptions}
      />
      <FormInputTeam
        user={user}
        editableOptions={editableOptions}
        isLoading={localTeamsFetching || isFetching}
        teams={teams}
        userTeam={userTeam}
        handleUpdateUser={handleUpdateUser}
        setEditableOptions={setEditableOptions}
        setUserTeam={setUserTeam}
      />

      <hr className="border-neutral-600" />
      <h2 className="text-stone-400 text-xl">Informações do aplicativo</h2>
      <div className="flex flex-col gap-1 relative">
        <label className="text-gray-100 font-bold text-xs" htmlFor="theme">
          Tema
        </label>
        <Select
          name="theme"
          disabled
          placeholder="Selecione um curso"
          defaultValue={'dark'}
          values={[
            { id: 'dark', name: 'Escuro' },
            { id: 'light', name: 'Claro' },
          ]}
        />
        <button className="absolute bottom-0 right-0 px-4 py-3">
          <PencilSimpleLine className="text-white" size={24} />
        </button>
      </div>
      <hr className="border-neutral-600" />
      <h2 className="text-stone-400 text-xl">Reportar bug</h2>
      <div className="flex flex-col gap-1 relative">
        <label className="text-gray-100 font-bold text-xs" htmlFor="desc">
          Descrição
        </label>
        <textarea
          rows={5}
          className="px-4 py-3 placeholder:text-sm bg-gray-900 rounded-md leading-6 disabled:text-neutral-600"
          name="desc"
        />
      </div>
      <Button className="bg-neutral-600">
        Reportar <Bug size={18} />
      </Button>
      <span className="text-sm font-bold text-neutral-600">
        Versão 0.1.0 | Direitos Reservados
      </span>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const courses = await prisma.course.findMany()

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) {
    return {
      redirect: {
        destination: '/',
      },
      props: {},
    }
  }

  if (!session.user.teamId) {
    return {
      redirect: {
        destination: '/register/form-step',
      },
      props: {},
    }
  }

  const uniqueTeam = await prisma.team.findUnique({
    where: {
      id: String(session?.user.teamId),
    },
  })

  return {
    props: { courses, user: session?.user, userTeam: uniqueTeam },
  }
}
