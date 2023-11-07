import { prisma } from '@/lib/prisma'
import { Course } from '@/models/classes'
import { toWeekDay } from './to-week-day'
import dayjs from 'dayjs'

export async function upsertData(courses: Course[]) {
  for (const course of courses) {
    const upsertedCourse = await prisma.course.upsert({
      create: {
        courseName: course.name,
      },
      update: {
        courseName: course.name,
      },
      where: {
        courseName: course.name,
      },
    })

    for (const team of course.teams) {
      const upsertedTeam = await prisma.team.upsert({
        create: {
          teamName: team.name,
          courseId: upsertedCourse.id,
        },
        update: {
          teamName: team.name,
          courseId: upsertedCourse.id,
        },
        where: {
          teamName_courseId: {
            teamName: team.name,
            courseId: upsertedCourse.id,
          },
        },
      })

      for (const weekDay of team.weekDays) {
        const weekDayInNumber = toWeekDay(weekDay.weekDay)

        const upsertedWeekDay = await prisma.weekDay.upsert({
          create: {
            weekDay: weekDayInNumber,
            teamId: upsertedTeam.id,
          },
          update: {
            weekDay: weekDayInNumber,
            teamId: upsertedTeam.id,
          },
          where: {
            weekDay_teamId: {
              weekDay: weekDayInNumber,
              teamId: upsertedTeam.id,
            },
          },
        })

        for (const teamClass of weekDay.classes) {
          const currentClassHour = dayjs(teamClass.hour).hour()

          const season =
            currentClassHour < 12
              ? 'MORNING'
              : currentClassHour < 18
              ? 'AFTERNOON'
              : 'NOCTURNAL'

          await prisma.class.upsert({
            create: {
              hour: teamClass.hour,
              name: teamClass.name,
              season,
              weekDayId: upsertedWeekDay.id,
            },
            update: {
              hour: teamClass.hour,
              name: teamClass.name,
              season,
              weekDayId: upsertedWeekDay.id,
            },
            where: {
              hour_weekDayId: {
                weekDayId: upsertedWeekDay.id,
                hour: teamClass.hour,
              },
            },
          })
        }
      }
    }
  }
}
