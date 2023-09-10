import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function GetAll(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end()
    }

    const { team } = req.query

    if (!!team && typeof team !== 'string') {
      return res.status(400).json({
        error: 'Invalid team name',
      })
    }

    const teams = await prisma.team.findMany({
      where: {
        teamName: {
          startsWith: team,
        },
      },
      include: {
        courses: {
          select: {
            courseName: true,
          },
        },
      },
    })

    return res.status(200).json(
      teams.map(({ courses, ...team }) => {
        return {
          ...team,
          courseName: courses.courseName,
        }
      }),
    )
  } catch (error) {
    return res.status(500)
  }
}
