import { api } from '..'

interface UpdateUserProps {
  name?: string
  teamId?: string
}

export async function updateUser({ name, teamId }: UpdateUserProps) {
  try {
    const { data } = await api.patch('/auth/user/updateUser', {
      name,
      teamId,
    })
    return data
  } catch (error) {
    console.error(error)
    throw new Error('Error on update User')
  }
}
