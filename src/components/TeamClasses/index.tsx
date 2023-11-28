import dayjs from 'dayjs'

interface TeamClassesProps {
  classes: {
    id: string
    hour: Date
    class: string
  }[]
}

export function TeamClasses({ classes }: TeamClassesProps) {
  return (
    <div className="flex w-full flex-col items-center justify-start gap-2 px-5 py-4">
      {classes.map((teamClass) => {
        return (
          <div
            className="flex w-full items-center justify-between text-sm font-bold text-slate-800"
            key={teamClass.id}
          >
            <span>{dayjs(teamClass.hour).format('HH:mm')}</span>
            <h1> {teamClass.class} </h1>
          </div>
        )
      })}
    </div>
  )
}
