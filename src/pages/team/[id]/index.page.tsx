import { Accordion } from '@/components/Accordion'
import { Button } from '@/components/Button'
import { TeamClasses } from '@/components/TeamClasses'
import { prisma } from '@/lib/prisma'
import { GetClassesResponse } from '@/models/team'
import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import { downloadHtml } from '@/utils/downloadHtml'
import { Course, Team } from '@prisma/client'
import dayjs from 'dayjs'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { useRouter } from 'next/router'
import { ArrowUUpLeft, FileArrowDown } from 'phosphor-react'
import { useRef } from 'react'

interface UniqueTeamProps {
  classes: GetClassesResponse[]
  team: Team
  course: Course
}

export default function UniqueTeam({ classes, course, team }: UniqueTeamProps) {
  const downloadClassesRef = useRef<HTMLDivElement>(null)
  const { back } = useRouter()

  return (
    <div className="flex flex-col gap-8 text-gray-100">
      <header className="flex gap-5 ">
        <button className="flex items-start justify-center" onClick={back}>
          <ArrowUUpLeft size={30} />
        </button>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Aulas da turma {team.teamName}</h1>
          <span className="text-sm text-neutral-600">{course.courseName}</span>
        </div>
      </header>
      <Accordion
        contents={classes.map((teamClass) => {
          return {
            title: dayjs(dayjs().isoWeekday(teamClass.weekDay)).format('dddd'),
            value: String(teamClass.weekDay),
            content: (
              <TeamClasses
                classes={teamClass.classes.map((dayClass) => {
                  return {
                    hour: dayjs(dayClass.hour).toDate(),
                    class: dayClass.name,
                    id: dayClass.id,
                  }
                })}
              />
            ),
          }
        })}
      />

      <div
        ref={downloadClassesRef}
        className={`absolute left-0 top-0 -z-50 hidden w-full max-w-md flex-col overflow-hidden bg-white p-5 text-black data-[print=true]:flex`}
      >
        <h1 className="text-lg font-bold">{team.teamName}</h1>
        {classes.map((teamClass) => {
          return (
            <div className="border-2 border-black" key={teamClass.id}>
              <h1 className="border border-black p-1 text-sm font-bold">
                {dayjs(dayjs().isoWeekday(teamClass.weekDay))
                  .format('dddd')
                  .toLocaleUpperCase()}
              </h1>
              <div className="flex flex-col text-xs">
                {teamClass.classes
                  .filter((teamCls) => teamCls.name.trim() !== '-')
                  .map((teamCls) => {
                    return (
                      <div
                        className="flex items-center justify-between border border-black px-2 py-1"
                        key={teamCls.id}
                      >
                        <time className="font-bold">
                          {dayjs(teamCls.hour).format('HH:mm')}
                        </time>{' '}
                        <h1>{teamCls.name}</h1>
                      </div>
                    )
                  })}
              </div>
            </div>
          )
        })}
      </div>

      <Button
        onClick={async () => {
          await downloadHtml(team.teamName, downloadClassesRef)
        }}
        className="w-80 bg-amber-500"
      >
        Baixar Aulas <FileArrowDown size={18} />
      </Button>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  res,
}) => {
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
