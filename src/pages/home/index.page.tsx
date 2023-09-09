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
      className={`bg-zinc-900 w-full min-h-screen h-full flex flex-col justify-start py-24 items-center gap-8 px-8 font-roboto`}
    >
      <div className="flex flex-col max-w-xl w-full gap-6 text-gray-100">
        <h1 className="font-bold text-2xl">Olá {user.name}</h1>
        <p className="font-semibold text-base">Aqui estão suas aulas!</p>
      </div>
      <main className="flex flex-col justify-center items-center w-full">
        <div className="flex justify-center items-center flex-col gap-5 max-w-xl w-full">
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
          <Button className="bg-amber-500 w-80">
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

  if (!session?.user || !session.user.email) {
    return {
      props: {},
      redirect: {
        destination: '/',
      },
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  })

  if (!user) {
    return {
      props: {},
      redirect: {
        destination: '/',
      },
    }
  }

  if (!user.teamId) {
    return {
      props: {},
      redirect: {
        destination: '/register/form-step',
      },
    }
  }

  const weekDays = await prisma.weekDay.findMany({
    where: {
      teamId: user.teamId,
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

  console.log(weekDays)

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

  console.log(classes)

  return {
    props: {
      user,
      classes,
    },
  }
}
