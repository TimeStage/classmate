import { api } from '..'

interface UserPutTeamIdProps {
  teamId: string
}

export async function userPutTeamId({ teamId }: UserPutTeamIdProps) {
  try {
    const { data } = await api.put('/auth/user/updateTeamId', {
      teamId,
    })
    return data
  } catch (error) {
    console.error(error)
    throw new Error('Error on put teamId')
  }
}
