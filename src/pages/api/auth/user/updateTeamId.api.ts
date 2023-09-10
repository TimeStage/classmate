import { prisma } from '@/lib/prisma'
import { updateClassSchema } from '@/validators/updateClass'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'PUT') {
      return res.status(405).end()
    }

    const { teamId, userEmail } = updateClassSchema.parse(req.body)

    const team = await prisma.team.findUnique({
      where: {
        id: teamId,
      },
    })

    if (!team) {
      return res.status(404).json({
        error: 'Team not found',
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    })

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      })
    }

    const userUpdated = await prisma.user.update({
      where: {
        email: userEmail,
      },
      data: {
        teamId,
      },
    })

    return res.status(200).json(userUpdated)
  } catch (error) {
    return res.status(500).json({
      error,
    })
  }
}
