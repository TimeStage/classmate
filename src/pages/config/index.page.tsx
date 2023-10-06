import { Select } from '@/components/Select'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { Bug, PencilSimpleLine } from 'phosphor-react'
import { buildNextAuthOptions } from '../api/auth/[...nextauth].api'
import { Course, Team, User } from '@prisma/client'
import { Button } from '@/components/Button'

interface ConfigProps {
  user: User
  courses: Course[]
  teams: Team[]
}

export default function Config({ courses, teams, user }: ConfigProps) {
  return (
    <main className="flex flex-col gap-6 w-full">
      <h2 className="text-stone-400 text-xl">Informações pessoais</h2>
      <div className="flex flex-col gap-1 relative">
        <label className="text-gray-100 font-bold text-xs" htmlFor="name">
          Nome
        </label>
        <input
          disabled
          className="px-4 py-3 placeholder:text-sm bg-gray-900 rounded-md leading-6 disabled:text-neutral-600"
          type="text"
          id="name"
          value="Davi Marcilio"
        />
        <button className="absolute bottom-0 right-0 px-4 py-3">
          <PencilSimpleLine className="text-white" size={24} />
        </button>
      </div>
      <div className="flex flex-col gap-1 relative">
        <label className="text-gray-100 font-bold text-xs" htmlFor="course">
          Curso
        </label>
        <Select
          name="course"
          disabled
          placeholder="Selecione um curso"
          defaultValue={teams.find((team) => team.id === user.teamId)?.courseId}
          values={courses.map((course) => {
            return {
              id: course.id,
              name: course.courseName,
            }
          })}
        />
        <button className="absolute bottom-0 right-0 px-4 py-3">
          <PencilSimpleLine className="text-white" size={24} />
        </button>
      </div>
      <div className="flex flex-col gap-1 relative">
        <label className="text-gray-100 font-bold text-xs" htmlFor="team">
          Turma
        </label>
        <Select
          name="team"
          disabled
          placeholder="Selecione um curso"
          defaultValue={String(user.teamId)}
          values={teams.map((team) => {
            return {
              id: team.id,
              name: team.teamName,
            }
          })}
        />
        <button className="absolute bottom-0 right-0 px-4 py-3">
          <PencilSimpleLine className="text-white" size={24} />
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

  const teams = await prisma.team.findMany()

  return {
    props: { courses, user: session?.user, teams },
  }
}
