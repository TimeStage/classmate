import { Role, User } from '@prisma/client'
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

interface updateUserRoleProps {
  userId: string
  role: Role
}

export async function updateUserRole({ role, userId }: updateUserRoleProps) {
  try {
    const { data } = await api.put<User>('/admin/auth/updateRole', {
      role,
      userId,
    })
    return data
  } catch (error) {
    console.error(error)
    throw new Error('Error on update user role')
  }
}
