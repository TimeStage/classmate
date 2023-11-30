import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

export default async function GetByCourse(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'GET' && req.method !== 'OPTIONS') {
      return res.status(405).end()
    }

    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: 'Team ID not provided',
      })
    }

    const session = await getServerSession(
      req,
      res,
      buildNextAuthOptions(req, res),
    )

    if (!session) {
      return res.status(401).end()
    }

    const classes = await prisma.weekDay.findMany({
      where: {
        teamId: id,
      },
      orderBy: {
        weekDay: 'asc',
      },
      include: {
        Class: {
          orderBy: {
            hour: 'asc',
          },
        },
      },
    })

    return res.status(200).json(classes)
  } catch (error) {
    return res.status(500)
  }
}
