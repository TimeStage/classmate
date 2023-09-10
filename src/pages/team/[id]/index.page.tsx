import { prisma } from '@/lib/prisma'
import { GetClassesResponse } from '@/models/team'
import { Course, Team } from '@prisma/client'
import dayjs from 'dayjs'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { ArrowUUpLeft } from 'phosphor-react'

interface UniqueTeamProps {
  classes: GetClassesResponse[]
  team: Team
  course: Course
}

export default function UniqueTeam({ classes, course, team }: UniqueTeamProps) {
  const { back } = useRouter()
  return (
    <div className="flex flex-col gap-8 text-gray-100">
      <header className="flex gap-5 ">
        <button className="flex justify-center items-start" onClick={back}>
          <ArrowUUpLeft size={30} />
        </button>
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-2xl">Aulas da turma {team.teamName}</h1>
          <span className="text-neutral-600 text-sm">Informática</span>
        </div>
      </header>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params!

  if (typeof id !== 'string') {
    return {
      props: {},
      redirect: {
        destination: '/team',
      },
    }
  }

  const prismaTeam = await prisma.team.findUnique({
    where: {
      id,
    },
    include: {
      courses: true,
    },
  })

  if (!prismaTeam) {
    return {
      props: {},
      redirect: { destination: '/team' },
    }
  }

  const prismaClasses = await prisma.weekDay.findMany({
    where: {
      teamId: id,
    },
    orderBy: {
      weekDay: 'asc',
    },
    include: {
      Class: {
        orderBy: {
          hour: 'asc',
        },
      },
    },
  })

  const classes = prismaClasses.map(({ Class, ...weekDay }) => {
    const classes = Class.map(({ hour, ...dayClass }) => {
      return {
        ...dayClass,
        hour: dayjs(hour).toISOString(),
      }
    })

    return {
      ...weekDay,
      classes,
    }
  })

  const { courses, ...team } = prismaTeam

  return {
    props: {
      team,
      course: courses,
      classes,
    },
  }
}
