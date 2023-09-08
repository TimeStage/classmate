import { NextApiRequest, NextApiResponse } from 'next'
import { isAuthenticated } from '@/middlewares/verify-auth-admin'
import { importExcelRequestSchema } from '@/validators/admin'
import { RowModel } from 'exceljs'
import {
  Class,
  FormattedCourses,
  FormattedWeekDaysReduce,
  Team,
  TeamWithClasses,
  WeekDay,
} from './models/classes'
import { upsertData } from './functions/upsert-data'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb', // Set desired value here
    },
  },
}

export default async function ImportExcel(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end()
    }

    await isAuthenticated(req, res)

    const { rows: rowsFromBody } = importExcelRequestSchema.parse(req.body)

    const rows: RowModel[] = rowsFromBody

    const teams: Team[] = []

    const tableHeader = rows.shift()

    tableHeader?.cells.forEach((cell) => {
      if (cell.value && typeof cell.value === 'string') {
        teams.push({
          column: String(cell.address).slice(
            0,
            String(cell.address).length - 1,
          ),
          value: cell.value,
        })
      }
    })

    const formattedTeams = teams.map((team) => {
      const arrayOfTeamsAndCourses = team.value.split(' ')

      const currentCourse =
        arrayOfTeamsAndCourses.length === 2
          ? arrayOfTeamsAndCourses[0]
          : arrayOfTeamsAndCourses[0] + arrayOfTeamsAndCourses[1]

      const currentTeam =
        arrayOfTeamsAndCourses[arrayOfTeamsAndCourses.length === 2 ? 1 : 2]

      return {
        value: `${currentCourse}_${currentTeam}`,
        column: team.column,
      }
    })

    const rawWeekDays = rows.map((row) => {
      return row.cells[0]
    })

    const formattedWeekDays: FormattedWeekDaysReduce[] = rawWeekDays.reduce(
      (acc: FormattedWeekDaysReduce[], row) => {
        return !!row.value &&
          !acc.includes({
            value: String(row.value),
            master: String(row.address),
          })
          ? [
              ...acc,
              {
                master: String(row.address),
                value: String(row.value),
              },
            ]
          : acc
      },
      [],
    )

    const allTeamsWithClasses: TeamWithClasses[] = []

    formattedTeams.forEach((team) => {
      const teamWeekDays: WeekDay[] = []
      formattedWeekDays.forEach((weekDay) => {
        const weekDayClasses: Class[] = []

        rows.forEach((row) => {
          row.cells.forEach((cell) => {
            if (
              String(cell.address).replace(/[0-9]/g, '') === team.column &&
              (row.cells[0].master === weekDay.master || !!row.cells[0].value)
            ) {
              weekDayClasses.push({
                hour: new Date(String(row.cells[1].value)),
                value: String(cell.value),
              })
            }
          })
        })

        teamWeekDays.push({
          weekDay: weekDay.value,
          classes: weekDayClasses,
        })
      })
      allTeamsWithClasses.push({
        column: team.column,
        value: team.value,
        weekDays: teamWeekDays,
      })
    })

    const courses = formattedTeams.reduce((acc: string[], { value }) => {
      const currentCourse = value.split('_')[0]

      return !acc.includes(currentCourse) ? [...acc, currentCourse] : acc
    }, [])

    const formattedCourses: FormattedCourses[] = courses.map((course) => {
      const allTeamsOfThisCourse = allTeamsWithClasses
        .filter(({ value }) => {
          return value.split('_')[0] === course
        })
        .map(({ value, weekDays }) => ({
          value: value.split('_')[1],
          weekDays,
        }))

      return {
        name: course,
        teams: allTeamsOfThisCourse,
      }
    })

    await upsertData(formattedCourses)

    return res.status(201).end()
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      error,
    })
  }
}
