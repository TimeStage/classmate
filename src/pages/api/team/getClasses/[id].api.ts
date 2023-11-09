import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function GetByCourse(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end()
    }

    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: 'Team ID not provided',
      })
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
