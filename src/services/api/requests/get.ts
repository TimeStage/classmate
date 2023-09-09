import {
  GetAllTeamsResponse,
  GetClassesResponse,
  GetTeamResponse,
} from '@/models/team'
import { api } from '..'

export async function teamsGetAll() {
  try {
    const { data } = await api.get<GetAllTeamsResponse[]>('/team/getAll')
    return data
  } catch (error) {
    console.error(error)
    throw new Error('Error on getting teams')
  }
}

interface TeamsGetByCourseProps {
  courseId: string
}

export async function teamsGetByCourse({ courseId }: TeamsGetByCourseProps) {
  try {
    const { data } = await api.get<GetTeamResponse[]>(
      `/team/getByCourse/${courseId}`,
    )
    return data
  } catch (error) {
    console.error(error)
    throw new Error('Error on getting team by course')
  }
}

interface TeamClassesProps {
  teamId: string
}

export async function getTeamClasses({ teamId }: TeamClassesProps) {
  try {
    const { data } = await api.get<GetClassesResponse>(
      `/team/getClasses/${teamId}`,
    )

    return data
  } catch (error) {
    console.error(error)
    throw new Error('Error on getting team classes')
  }
}
