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
    <div className="w-full flex flex-col items-center justify-start px-5 py-4 gap-2">
      {classes.map((teamClass) => {
        return (
          <div
            className="flex justify-between items-center w-full font-bold text-sm text-slate-800"
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
