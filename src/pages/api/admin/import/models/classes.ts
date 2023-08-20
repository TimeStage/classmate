export interface Team {
  value: string
  column: string
}

export interface Class {
  value: string
  hour: Date
}

export interface WeekDay {
  weekDay: string
  classes: Class[]
}

export interface TeamWithClasses extends Team {
  weekDays: WeekDay[]
}

export interface FormattedCourses {
  name: string
  teams: {
    value: string
    weekDays: WeekDay[]
  }[]
}

export interface FormattedWeekDaysReduce {
  value: string
  master: string
}
