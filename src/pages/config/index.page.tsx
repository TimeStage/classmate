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
import { newReport } from '@/services/api/requests/post'

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

  const [reportDescription, setReportDescription] = useState('')
  const { data: teams, isFetching: localTeamsFetching } = useQuery(
    ['teams', editableOptions.courseId ?? userTeam?.courseId],
    async () => {
      if (editableOptions.courseId || userTeam?.courseId) {
        const teams = await teamsGetByCourse({
          courseId: editableOptions.courseId
            ? editableOptions.courseId
            : userTeam?.courseId
              ? userTeam.courseId
              : courses[0].id,
        })

        return teams
      }
      return undefined
    },
  )

  async function onSendNewReport(description: string, userId: string) {
    if (!description) {
      toast.error('Por favor adicione uma descrição para reportar um problema!')
    }

    try {
      await newReport({
        description,
        userId,
      })
      setReportDescription('')
      toast.success('Reportado com sucesso!')
    } catch (error) {
      console.error(error)
      toast.success('Erro ao reportar problema!')
    }
  }

  async function handleUpdateUser(
    infoToUpdate: keyof EditableOptionsProps,
    editableOptions: EditableOptionsProps,
  ) {
    try {
      setIsFetching(true)
      await updateUser({
        [infoToUpdate]: editableOptions[infoToUpdate].trim(),
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
    <main className="flex w-full flex-col gap-6 md:m-auto  md:max-w-lg">
      <h2 className="text-xl text-stone-400">Informações pessoais</h2>
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
      <h2 className="text-xl text-stone-400">Informações do aplicativo</h2>
      <div className="relative flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-100" htmlFor="theme">
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
      <h2 className="text-xl text-stone-400">Reportar bug</h2>
      <div className="relative flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-100" htmlFor="desc">
          Descrição
        </label>
        <textarea
          value={reportDescription}
          onChange={(event) => {
            setReportDescription(event.target.value)
          }}
          rows={5}
          className="rounded-md bg-gray-900 px-4 py-3 leading-6 text-white placeholder:text-sm disabled:text-neutral-600"
          name="desc"
        />
      </div>
      <Button
        onClick={() => {
          onSendNewReport(reportDescription, user.id)
        }}
        disabled={!reportDescription}
        className="bg-amber-500 disabled:bg-neutral-600"
      >
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
