import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { Button } from '@/components/Button'
import { buildNextAuthOptions } from '../api/auth/[...nextauth].api'
import { FileArrowDown } from 'phosphor-react'
import { Accordion } from '@/components/Accordion'
import { TeamClasses } from '@/components/TeamClasses'
import { GetClassesResponse } from '@/models/team'
import { User } from '@prisma/client'
import dayjs from 'dayjs'

interface HomeProps {
  user: User
  classes: GetClassesResponse[]
}

export default function Home({ user, classes }: HomeProps) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center  justify-start gap-8  `}
    >
      <div className="flex w-full max-w-xl flex-col gap-6 text-gray-100">
        <h1 className="text-2xl font-bold">Olá, {user.name}</h1>
        <p className="text-base font-semibold">Aqui estão suas aulas!</p>
      </div>
      <main className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full max-w-xl flex-col items-center justify-center gap-5">
          <Accordion
            contents={classes.map((teamClass) => {
              return {
                title: dayjs(dayjs().isoWeekday(teamClass.weekDay)).format(
                  'dddd',
                ),
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
          <Button className="w-80 bg-amber-500">
            Baixar Aulas <FileArrowDown size={18} />
          </Button>
        </div>
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

  const weekDays = await prisma.weekDay.findMany({
    where: {
      teamId: session?.user.teamId ?? undefined,
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

  const classes = weekDays.map(({ Class, ...weekDay }) => {
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

  return {
    props: {
      user: session?.user,
      classes,
    },
  }
}
