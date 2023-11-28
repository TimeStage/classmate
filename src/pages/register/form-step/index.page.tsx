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
      className={` flex h-full w-full flex-col items-center justify-center gap-16 `}
    >
      <header className="flex w-full max-w-xl flex-col gap-6 text-gray-100 ">
        <h1 className="text-2xl font-bold">Você está quase lá!</h1>
        <p className="text-base font-semibold">
          Agora só falta algumas informações
        </p>
      </header>
      <main className="flex w-full flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full max-w-xl flex-col items-center justify-center gap-5"
        >
          <div className="flex w-full flex-col gap-1">
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
          <div className="flex w-full flex-col gap-1">
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
            <p className="pl-2 text-sm text-red-500">
              {errors.teamId?.message}
            </p>
          </div>
          <Button
            disabled={
              isSubmitting || isLoading || !selectedCourseId || !selectedTeamId
            }
            type="submit"
            className="w-full bg-amber-500"
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
