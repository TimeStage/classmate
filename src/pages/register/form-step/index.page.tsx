import { Button } from '@/components/Button'
import { Select } from '@/components/Select'
import { prisma } from '@/lib/prisma'
import { Course } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { GetServerSideProps } from 'next'
import { ArrowRight } from 'phosphor-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/router'
import { User, getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import { userPutTeamId } from '@/services/api/requests/put'
import { teamsGetByCourse } from '@/services/api/requests/get'
interface FormStepProps {
  courses: Course[]
  user: User
}

const formDataSchema = z.object({
  teamId: z
    .string({
      required_error: 'Selecione uma turma',
    })
    .uuid('Selecione uma turma'),
})

type FormData = z.infer<typeof formDataSchema>

export default function FormStep({ courses, user }: FormStepProps) {
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [selectedTeamId, setSelectedTeamId] = useState('')

  const router = useRouter()

  const { data: teams, isLoading } = useQuery(
    ['teams', selectedCourseId],
    async () => {
      const selectedTeams = teamsGetByCourse({
        courseId: selectedCourseId,
      })
      return selectedTeams
    },
    {
      enabled: !!selectedCourseId,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  )

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    values: {
      teamId: selectedTeamId,
    },
  })

  async function onSubmit(data: FormData) {
    const { teamId } = data

    await userPutTeamId({
      teamId,
    })
    router.push('/home')
  }

  return (
    <div
      className={` flex flex-col justify-center items-center gap-16 w-full h-full `}
    >
      <header className="flex flex-col max-w-xl w-full gap-6 text-gray-100 ">
        <h1 className="font-bold text-2xl">Você está quase lá!</h1>
        <p className="font-semibold text-base">
          Agora só falta algumas informações
        </p>
      </header>
      <main className="flex flex-col justify-center items-center w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex justify-center items-center flex-col gap-5 max-w-xl w-full"
        >
          <div className="flex flex-col gap-1 w-full">
            <Select
              onValueChange={(value) => {
                setSelectedCourseId(value)
                setSelectedTeamId('')
              }}
              placeholder="Selecione um curso"
              values={courses.map((course) => {
                return {
                  id: course.id,
                  name: course.courseName,
                }
              })}
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Select
              onValueChange={(value) => {
                setSelectedTeamId(value)
              }}
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
            <p className="text-sm text-red-500 pl-2">
              {errors.teamId?.message}
            </p>
          </div>
          <Button
            disabled={
              isSubmitting || isLoading || !selectedCourseId || !selectedTeamId
            }
            type="submit"
            className="bg-amber-500 w-full"
          >
            Finalizar
            <ArrowRight size={16} />
          </Button>
        </form>
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

  if (!session) {
    return {
      props: {},
      redirect: {
        destination: '/',
      },
    }
  }

  if (session.user.teamId) {
    return {
      props: {},
      redirect: {
        destination: '/home',
      },
    }
  }

  const courses = await prisma.course.findMany()

  return {
    props: { courses, user: session?.user },
  }
}
