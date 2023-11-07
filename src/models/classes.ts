export interface Team {
  value: string
  column: string
}

export interface Class {
  name: string
  hour: Date
}

export interface WeekDay {
  weekDay: string
  classes: Class[]
}

export interface TeamWithClasses extends Team {
  weekDays: WeekDay[]
}

export interface Course {
  name: string
  teams: {
    name: string
    weekDays: WeekDay[]
  }[]
}

export interface FormattedWeekDaysReduce {
  value: string
  master: string
}
