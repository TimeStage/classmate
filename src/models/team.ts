export interface GetTeamResponse {
  id: string
  teamName: string
  courseId: string
}

export interface GetAllTeamsResponse {
  id: string
  teamName: string
  courseId: string
  courseName: string
}

export interface TeamClass {
  id: string
  hour: string
  name: string
  weekDayId: string
  season: string
}

export interface GetClassesResponse {
  id: string
  weekDay: number
  teamId: string
  classes: TeamClass[]
}
