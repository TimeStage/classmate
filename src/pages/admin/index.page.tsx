import { FastAccessCard } from './components/FastAccessCard'
import { ClipboardText, PencilSimpleLine, UploadSimple } from 'phosphor-react'
import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../api/auth/[...nextauth].api'
import { Class, Course, Team, WeekDay } from '@prisma/client'
import { TeamClasses } from '@/components/TeamClasses'
import dayjs from 'dayjs'
import { useRef } from 'react'
import { useDraggable } from 'react-use-draggable-scroll'

interface WeekDays {
  weekDay: WeekDay
  Class: Class[]
}

interface Teams extends Team {
  WeekDay: WeekDays[]
}

interface ClassesResponse extends Course {
  Team: Teams[]
}

interface AdminPageProps {
  classes: ClassesResponse[]
}

export default function AdminPage({ classes }: AdminPageProps) {
  const ref =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>
  const { events } = useDraggable(ref)

  return (
    <main className="flex max-w-[100vw] flex-col gap-10 overflow-hidden py-10">
      <div className="flex flex-col gap-10 ">
        <h1 className="text-3xl font-bold text-gray-100 max-sm:text-center">
          Menu de acesso rápido
        </h1>
        <div className="grid grid-cols-4 gap-5 max-sm:flex max-sm:flex-col">
          <FastAccessCard href="/admin/import">
            <UploadSimple size={32} /> Importar cronôgrama
          </FastAccessCard>
          <FastAccessCard href="/admin/users">
            <ClipboardText size={32} /> Gerenciar administradores
          </FastAccessCard>
          <FastAccessCard className="cursor-not-allowed opacity-70" href="/">
            <PencilSimpleLine size={32} /> Criar/Editar cronôgrama
          </FastAccessCard>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <h1 className="text-3xl font-bold text-gray-100">Aulas</h1>
        <div className="flex w-full max-w-[calc(100vw-5.04rem)] flex-col gap-5 ">
          <div className="flex flex-col gap-5  rounded-lg bg-slate-900 p-5 ">
            <h1 className="text-2xl font-bold  text-gray-50">Cedup CLASS</h1>
            <header>
              <h1 className="bg-amber-500 px-5 py-2 text-2xl font-semibold">
                Turmas
              </h1>
              <div
                ref={ref}
                {...events}
                className="flex w-full items-start justify-between overflow-x-auto bg-yellow-300 text-lg font-semibold"
              >
                {classes.map((class1) => {
                  return (
                    <div
                      className="flex w-max flex-col items-center justify-center border-x-2"
                      key={class1.id}
                    >
                      <h1>{class1.courseName}</h1>
                      <div className="flex w-full">
                        {class1.Team.map((team) => {
                          return (
                            <div
                              key={team.id}
                              className="flex w-96 flex-col gap-2 bg-slate-950 p-2 text-gray-100  max-sm:w-80"
                            >
                              <h1 className="text-xl font-medium">
                                {team.teamName}
                              </h1>
                              <div>
                                {team.WeekDay.map((teamClass) => {
                                  return (
                                    <div key={teamClass.weekDay.id}>
                                      <h1 className="flex w-full items-center justify-between bg-amber-600 p-3 font-roboto font-bold text-slate-200">
                                        {dayjs(
                                          dayjs().isoWeekday(
                                            teamClass.weekDay.weekDay,
                                          ),
                                        ).format('dddd')}
                                      </h1>
                                      <div className="w-full overflow-hidden bg-amber-300 data-[state=closed]:animate-closeAccordion data-[state=open]:animate-openAccordion">
                                        <TeamClasses
                                          classes={teamClass.Class.map(
                                            (dayClass) => {
                                              return {
                                                hour: dayjs(
                                                  dayClass.hour,
                                                ).toDate(),
                                                class: dayClass.name,
                                                id: dayClass.id,
                                              }
                                            },
                                          )}
                                        />
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </header>
          </div>
        </div>
      </div>
    </main>
  )
}
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (session?.user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/home',
      },
      props: {},
    }
  }

  const allClasses = await prisma.course.findMany({
    include: {
      Team: {
        include: {
          WeekDay: {
            include: {
              Class: {
                orderBy: {
                  hour: 'asc',
                },
              },
            },
          },
        },
      },
    },
  })

  return {
    props: {
      classes: allClasses.map(({ Team, ...classes }) => ({
        ...classes,
        Team: Team.map(({ WeekDay, ...team }) => ({
          ...team,
          WeekDay: WeekDay.map(({ Class, ...weekDay }) => ({
            weekDay,
            Class: Class.map(({ hour, ...class1 }) => ({
              ...class1,
              hour: hour.toISOString(),
            })),
          })),
        })),
      })),
      user: session?.user,
    },
  }
}
