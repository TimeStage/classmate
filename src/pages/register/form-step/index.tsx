import { Button } from '@/components/Button'
import { Select } from '@/components/Select'
import { api } from '@/lib/axios'
import { roboto } from '@/lib/fonts/roboto'
import { prisma } from '@/lib/prisma'
import { GetTeamResponse } from '@/models/team'
import { Course } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { GetStaticProps } from 'next'
import { ArrowRight } from 'phosphor-react'
import { useState } from 'react'

interface FormStepProps {
  courses: Course[]
}

export default function FormStep({ courses }: FormStepProps) {
  const [selectedCourseId, setSelectedCourseId] = useState('')

  const { data: teams, isLoading } = useQuery(
    ['teams', selectedCourseId],
    async () => {
      const { data: selectedTeams } = await api.get<GetTeamResponse[]>(
        `/team/getByCourse/${selectedCourseId}`,
      )
      return selectedTeams
    },
    {
      enabled: !!selectedCourseId,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  )

  return (
    <div
      className={`bg-zinc-900 w-screen h-screen flex flex-col justify-center items-center gap-16 ${roboto.className} `}
    >
      <header className="flex flex-col max-w-xl w-full gap-6 text-gray-100 ">
        <h1 className="font-bold text-2xl">Você está quase lá!</h1>
        <p className="font-semibold text-base">
          Agora só falta algumas informações
        </p>
      </header>
      <main className="flex flex-col justify-center items-center w-full">
        <form className="flex justify-center items-center flex-col gap-5 max-w-xl w-full">
          <Select
            onValueChange={(value) => {
              setSelectedCourseId(value)
            }}
            placeholder="Selecione um curso"
            values={courses.map((course) => {
              return {
                id: course.id,
                name: course.courseName,
              }
            })}
          />
          <Select
            disabled={
              !teams || !selectedCourseId || isLoading || teams.length === 0
            }
            placeholder="Selecione uma turma"
            values={
              teams && teams.length > 0
                ? teams.map((team) => {
                    return {
                      id: team.id,
                      name: team.teamName,
                    }
                  })
                : []
            }
          />
          <Button className="bg-amber-500 w-full">
            Finalizar
            <ArrowRight size={16} />
          </Button>
        </form>
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const courses = await prisma.course.findMany()

  return {
    props: { courses },
  }
}
