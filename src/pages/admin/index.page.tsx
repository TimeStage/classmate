import { useQuery } from '@tanstack/react-query'
import { teamsGetAll } from '@/services/api/requests/get'
import { FastAccessCard } from './components/FastAccessCard'
import { UploadSimple } from 'phosphor-react'
import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../api/auth/[...nextauth].api'
import { Class, Course, Team, WeekDay } from '@prisma/client'
import { ClassesTable } from './components/ClassesTable'
import { TeamClasses } from '@/components/TeamClasses'
import { Accordion } from '@/components/Accordion'
import dayjs from 'dayjs'

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
  const { data: teams } = useQuery(['AllTeams'], async () => {
    const teams = await teamsGetAll()

    return teams
  })

  return (
    <main className="flex flex-col py-10 gap-10 overflow-hidden">
      <div className="flex flex-col gap-10">
        <h1 className="text-gray-100 font-bold text-3xl">
          Menu de acesso rápido
        </h1>
        <div className="grid grid-cols-4 gap-5">
          <FastAccessCard href="/admin/import">
            <UploadSimple size={32} /> Importar cronôgrama
          </FastAccessCard>
          {/* {teams?.map((team) => (
            <TeamCard
              key={team.id}
              teamName={team.teamName}
              courseName={team.courseName}
            />
          ))} */}
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <h1 className="text-gray-100 font-bold text-3xl">Aulas</h1>
        <div className="flex flex-col gap-5 max-w-screen-xl overflow-x-auto">
          <div className="bg-slate-900 rounded-lg p-5 flex flex-col gap-5 max-w-none ">
            <h1 className="font-bold text-2xl  text-gray-50">Cedup CLASS</h1>
            <header>
              <h1 className="bg-amber-500 text-2xl font-semibold py-2 px-5">
                Turmas
              </h1>
              <div className="flex w-full items-center bg-yellow-300 text-lg font-semibold justify-between ">
                {classes.map((class1) => {
                  return (
                    <div
                      className="flex flex-col justify-center items-center w-full border-x-2"
                      key={class1.id}
                    >
                      <h1>{class1.courseName}</h1>
                      <div className="flex w-full">
                        {class1.Team.map((team) => {
                          return (
                            <div
                              key={team.id}
                              className="flex flex-col bg-slate-950 text-gray-100 w-96 p-2  gap-2"
                            >
                              <h1 className="text-xl font-medium">
                                {team.teamName}
                              </h1>
                              <div>
                                {team.WeekDay.map((teamClass) => {
                                  return (
                                    <div key={teamClass.weekDay.id}>
                                      <h1 className="bg-amber-600 text-slate-200 font-bold w-full p-3 font-roboto flex items-center justify-between">
                                        {dayjs(
                                          dayjs().isoWeekday(
                                            teamClass.weekDay.weekDay,
                                          ),
                                        ).format('dddd')}
                                      </h1>
                                      <div className="bg-amber-300 w-full data-[state=open]:animate-openAccordion data-[state=closed]:animate-closeAccordion overflow-hidden">
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
            {/* <table className=" ">
              <thead className="">
                <tr className="bg-amber-500 text-2xl">
                  <th colSpan={classes.length}> Turmas</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-yellow-300 text-lg font-semibold ">
                  {classes.map((class1) => {
                    return (
                      <td className="text-center p-2" key={class1.id}>
                        {class1.courseName}
                      </td>
                    )
                  })}
                </tr>
                <tr className="bg-yellow-300 text-lg font-semibold ">
                  {classes.map((class1) => {
                    return class1.Team.map((team) => {
                      return (
                        <>
                          <span className="flex flex-col dis p-2 bg-slate-950 text-gray-50">
                            {' '}
                            {team.teamName}{' '}
                          </span>
                        </>
                      )
                    })
                  })}
                </tr>
              </tbody>
            </table> */}
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

  const allClasses = await prisma.course.findMany({
    include: {
      Team: {
        include: {
          WeekDay: {
            include: {
              Class: true,
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
