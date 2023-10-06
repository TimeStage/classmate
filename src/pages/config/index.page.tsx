import { Select } from '@/components/Select'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { Bug, Check, PencilSimpleLine } from 'phosphor-react'
import { buildNextAuthOptions } from '../api/auth/[...nextauth].api'
import { Course, Team, User } from '@prisma/client'
import { Button } from '@/components/Button'
import { useState } from 'react'
import { updateUser } from '@/services/api/requests/patch'
import { toast } from 'react-toastify'
import { Spinner } from '@/components/Spinner'
import { useQuery } from '@tanstack/react-query'
import { teamsGetByCourse } from '@/services/api/requests/get'

interface ConfigProps {
  user: User
  courses: Course[]
  teams: Team[]
}

interface EditableOptionsProps {
  name: string
  courseId: string
  teamId: string
}

export default function Config({ courses, user, teams }: ConfigProps) {
  const [editableOptions, setEditableOptions] = useState(
    {} as EditableOptionsProps,
  )
  const [isFetching, setIsFetching] = useState(false)

  const [rerenderTeamInput, setRerenderTeamInput] = useState(false)

  const { data: localTeams } = useQuery(
    [
      'teams',
      editableOptions.courseId ??
        teams.find((team) => team.id === user.teamId)?.courseId,
    ],
    async () => {
      const teams = await teamsGetByCourse({
        courseId: editableOptions.courseId,
      })
      setRerenderTeamInput(false)

      return teams
    },
    {
      enabled: !!editableOptions.courseId,
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

  const teamsToTeamsInput =
    localTeams?.map((team) => {
      return {
        id: team.id,
        name: team.teamName,
      }
    }) ??
    teams.map((team) => {
      return {
        id: team.id,
        name: team.teamName,
      }
    })

  return (
    <main className="flex flex-col gap-6 w-full">
      <h2 className="text-stone-400 text-xl">Informações pessoais</h2>
      <div className="flex flex-col gap-1 relative">
        <label className="text-gray-100 font-bold text-xs" htmlFor="name">
          Nome
        </label>
        <input
          disabled={!editableOptions.name}
          className="px-4 py-3 placeholder:text-sm bg-gray-900 rounded-md leading-6 text-gray-100 disabled:text-neutral-600"
          type="text"
          id="name"
          onChange={(event) => {
            setEditableOptions(({ name, ...state }) => {
              return {
                ...state,
                name: event.target.value,
              }
            })
          }}
          defaultValue={user.name ?? 'Insira seu nome!'}
        />
        <button
          onClick={() => {
            if (!editableOptions.name) {
              setEditableOptions(({ name, ...state }) => {
                return {
                  ...state,
                  name: user.name ?? '',
                }
              })
            }
            if (!!editableOptions.name && editableOptions.name !== user.name) {
              handleUpdateUser('name', editableOptions)
            }
            if (!!editableOptions.name && editableOptions.name === user.name) {
              setEditableOptions(({ name, ...state }) => {
                return {
                  ...state,
                  name: '',
                }
              })
            }
          }}
          className="absolute bottom-0 right-0 px-4 py-3"
        >
          {!editableOptions.name ? (
            <PencilSimpleLine className="text-white" size={24} />
          ) : isFetching ? (
            <Spinner size={24} />
          ) : (
            <Check className="text-white" size={24} />
          )}
        </button>
      </div>
      <div className="flex flex-col gap-1 relative">
        <label className="text-gray-100 font-bold text-xs" htmlFor="course">
          Curso
        </label>
        <Select
          hasIcon={false}
          name="course"
          disabled={!editableOptions.courseId}
          placeholder="Selecione um curso"
          onValueChange={(value) => {
            setEditableOptions(({ courseId, ...state }) => {
              return {
                ...state,
                courseId: value,
              }
            })
            setRerenderTeamInput(true)
          }}
          defaultValue={teams.find((team) => team.id === user.teamId)?.courseId}
          values={courses.map((course) => {
            return {
              id: course.id,
              name: course.courseName,
            }
          })}
        />
        <button
          onClick={() => {
            if (!editableOptions.courseId) {
              setEditableOptions(({ courseId, ...state }) => {
                return {
                  ...state,
                  courseId:
                    teams.find((team) => team.id === user.teamId)?.courseId ??
                    '',
                }
              })
            }

            if (
              !!editableOptions.courseId &&
              editableOptions.courseId ===
                teams.find((team) => team.id === user.teamId)?.courseId
            ) {
              setEditableOptions(({ courseId, ...state }) => {
                return {
                  ...state,
                  courseId: '',
                }
              })
            }
          }}
          className="absolute bottom-0 right-0 px-4 py-3"
        >
          {!editableOptions.courseId ? (
            <PencilSimpleLine className="text-white" size={24} />
          ) : isFetching ? (
            <Spinner size={24} />
          ) : (
            <Check className="text-white" size={24} />
          )}
        </button>
      </div>
      <div className="flex flex-col gap-1 relative">
        <label className="text-gray-100 font-bold text-xs" htmlFor="team">
          Turma
        </label>
        {!rerenderTeamInput ? (
          <Select
            name="team"
            hasIcon={false}
            disabled={!editableOptions.teamId}
            placeholder="Selecione uma turma"
            onValueChange={(value) => {
              setEditableOptions(({ teamId, ...state }) => {
                return {
                  ...state,
                  teamId: value,
                }
              })
            }}
            defaultValue={
              teamsToTeamsInput.find((team) => team.id === user.teamId)?.id ??
              undefined
            }
            values={teamsToTeamsInput}
          />
        ) : (
          <div className="bg-gray-900 flex justify-between items-center rounded-md w-full leading-6 text-white disabled:cursor-not-allowed disabled:text-neutral-600 text-sm px-4 py-3 ">
            <Spinner size={24} />
          </div>
        )}

        <button
          onClick={() => {
            if (!editableOptions.teamId) {
              setEditableOptions(({ teamId, ...state }) => {
                return {
                  ...state,
                  teamId: user.teamId ?? '',
                }
              })
            }
            if (
              !!editableOptions.teamId &&
              editableOptions.teamId !== user.teamId
            ) {
              handleUpdateUser('teamId', editableOptions)
            }

            if (
              !!editableOptions.teamId &&
              editableOptions.teamId === user.teamId
            ) {
              setEditableOptions(({ teamId, ...state }) => {
                return {
                  ...state,
                  teamId: '',
                }
              })
            }
          }}
          className="absolute bottom-0 right-0 px-4 py-3"
        >
          {!editableOptions.teamId ? (
            <PencilSimpleLine className="text-white" size={24} />
          ) : isFetching ? (
            <Spinner size={24} />
          ) : (
            <Check className="text-white" size={24} />
          )}
        </button>
      </div>
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

  const uniqueTeam = await prisma.team.findUnique({
    where: {
      id: String(session?.user.teamId),
    },
  })

  const teamsByCourseId = await prisma.team.findMany({
    where: {
      courseId: uniqueTeam?.courseId,
    },
    orderBy: {
      teamName: 'asc',
    },
  })

  return {
    props: { courses, user: session?.user, teams: teamsByCourseId },
  }
}
