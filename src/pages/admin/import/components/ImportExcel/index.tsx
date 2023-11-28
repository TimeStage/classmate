import { adminImportFile } from '@/services/api/requests/post'
import { UploadSimple } from 'phosphor-react'
import { Dispatch, SetStateAction, useState } from 'react'
import Excel from 'exceljs'
import { toast } from 'react-toastify'
import {
  Class,
  Course,
  FormattedWeekDaysReduce,
  Team,
  TeamWithClasses,
  WeekDay,
} from '@/models/classes'
import dayjs from 'dayjs'
import { Spinner } from '@/components/Spinner'
import { SelectedArchive } from './components/SelectedArchive'
import { ImportButtonLoader } from './components/ImportButtonLoader'

export function ImportExcel() {
  const [file, setFile] = useState<File>()
  const [inputFileValue, setInputFileValue] = useState<string>('')

  const [loader, setLoader] = useState<number>(0)

  async function handleUploadFile() {
    try {
      if (!file) {
        return
      }

      setLoader(1)

      const workbook = new Excel.Workbook()

      setLoader(2)

      await workbook.xlsx.load(Buffer.from(await file.arrayBuffer()))

      setLoader(3)

      const worksheet = workbook.worksheets[0]
      setLoader(4)

      if (!worksheet) {
        toast.error('Ocorreu um erro ao importar o excel!')
        return
      }

      const originalRows = worksheet.getRows(1, 100)

      setLoader(5)

      if (!originalRows) {
        toast.error('Ocorreu um erro ao importar o excel!')
        return
      }

      const originalCoursesAndTeams = originalRows[0].values

      setLoader(6)

      if (!originalCoursesAndTeams || !Array.isArray(originalCoursesAndTeams)) {
        toast.error('Ocorreu um erro ao importar o excel!')

        return
      }

      const teams: Team[] = []

      const weekDays: FormattedWeekDaysReduce[] = []

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
          row.eachCell((cell) => {
            if (cell.value && typeof cell.value === 'string') {
              const arrayOfTeamsAndCourses = cell.value.split(' ')

              const currentCourse =
                arrayOfTeamsAndCourses.length === 2
                  ? arrayOfTeamsAndCourses[0]
                  : arrayOfTeamsAndCourses[0] + arrayOfTeamsAndCourses[1]

              const currentTeam =
                arrayOfTeamsAndCourses[
                  arrayOfTeamsAndCourses.length === 2 ? 1 : 2
                ]

              teams.push({
                value: `${currentCourse}_${currentTeam}`,
                column: String(cell.address).slice(
                  0,
                  String(cell.address).length - 1,
                ),
              })
            }
          })
        }
      })

      setLoader(15)

      worksheet.getColumn(1).eachCell((cell) => {
        if (
          !!cell.value &&
          !weekDays.find((weekDay) => weekDay.value === cell.value) &&
          !weekDays.includes({
            value: String(cell.value),
            master: String(cell.address),
          })
        ) {
          weekDays.push({
            value: String(cell.value),
            master: String(cell.address),
          })
        }
      })

      setLoader(25)

      const allTeamsWithClasses: TeamWithClasses[] = []

      teams.forEach((team) => {
        const teamWeekDays: WeekDay[] = []
        weekDays.forEach((weekDay) => {
          const weekDayClasses: Class[] = []

          worksheet.eachRow((row) => {
            row.eachCell((cell) => {
              if (
                String(cell.address).replace(/[0-9]/g, '') === team.column &&
                row.getCell(1).master.address === weekDay.master
              ) {
                weekDayClasses.push({
                  hour: dayjs(String(row.getCell(2).value))
                    .startOf('years')
                    .set(
                      'hours',
                      dayjs(String(row.getCell(2).value))
                        .add(3, 'hours')
                        .hour(),
                    )
                    .set(
                      'minutes',
                      dayjs(String(row.getCell(2).value)).minute() + 7,
                    )
                    .toDate(),
                  name: String(cell.value),
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

      setLoader(63)

      const courses = teams.reduce((acc: string[], { value }) => {
        const currentCourse = value.split('_')[0]

        return !acc.includes(currentCourse) ? [...acc, currentCourse] : acc
      }, [])

      setLoader(89)

      const formattedCourses: Course[] = courses.map((course) => {
        const allTeamsOfThisCourse = allTeamsWithClasses
          .filter(({ value }) => {
            return value.split('_')[0] === course
          })
          .map(({ value, weekDays }) => ({
            name: value.split('_')[1],
            weekDays,
          }))

        return {
          name: course,
          teams: allTeamsOfThisCourse,
        }
      })

      setLoader(99)

      await adminImportFile({
        courses: formattedCourses,
      })

      setLoader(100)

      toast.success('Importação bem sucedida')
    } catch (error) {
      console.error(error)
      toast.error('Ocorreu um erro inesperado na importação do template')
    } finally {
      setLoader(0)
      setFile(undefined)
      setInputFileValue('')
    }
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div
        data-loader={loader !== 0 ? 'loading' : 'none'}
        className={`relative flex w-full flex-col items-center justify-center gap-4 rounded-t-md border-4 border-b-0 border-dashed border-amber-500 p-20 transition-all hover:opacity-70 data-[loader=loading]:cursor-not-allowed data-[loader=loading]:opacity-70 `}
      >
        <UploadSimple className={`text-amber-500`} size={32} />
        <p className={`text-lg font-bold text-amber-500`}>Arraste e solte!</p>
        <SelectedArchive file={file} />
        <input
          disabled={loader !== 0}
          className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          onChange={(event) => {
            if (event.target.files && event.target.files.length > 0) {
              if (
                ![
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  '',
                ].includes(event.target.files[0].type)
              ) {
                toast.error('Arquivo selecionado tem o formato errado!')
                setFile(undefined)
                return
              }
              setInputFileValue(event.target.value)
              setFile(event.target.files[0])
            }
          }}
          value={inputFileValue}
          type="file"
        />
      </div>
      <button
        disabled={!file || loader !== 0}
        className={`flex h-full items-center justify-center gap-2 rounded-b-md bg-amber-500 px-10 py-5 font-semibold text-white transition-all hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-70`}
        onClick={handleUploadFile}
      >
        <ImportButtonLoader loader={loader} />
      </button>
    </div>
  )
}
