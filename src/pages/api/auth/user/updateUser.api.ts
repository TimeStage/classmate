import { prisma } from '@/lib/prisma'
import { updateUser } from '@/validators/updateUser'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../[...nextauth].api'

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'PATCH') {
      return res.status(405).end()
    }

    const { teamId, name } = updateUser.parse(req.body)

    const session = await getServerSession(
      req,
      res,
      buildNextAuthOptions(req, res),
    )

    if (!session) {
      return res.status(401).end()
    }

    if (teamId) {
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
    }

    const userUpdated = await prisma.user.update({
      where: {
        id: session?.user.id,
      },
      data: {
        teamId,
        name,
      },
    })

    return res.status(200).json(userUpdated)
  } catch (error) {
    return res.status(500).json({
      error,
    })
  }
}
