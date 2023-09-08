import { api } from '..'

interface UserPutTeamIdProps {
  userEmail: string
  teamId: string
}

export async function userPutTeamId({ teamId, userEmail }: UserPutTeamIdProps) {
  try {
    const { data } = await api.put('/auth/user/updateTeamId', {
      userEmail,
      teamId,
    })
    return data
  } catch (error) {
    console.error(error)
    throw new Error('Error on put teamId')
  }
}
