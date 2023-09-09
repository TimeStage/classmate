import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/middlewares/verify-auth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function GetAll(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end()
    }

    await isAuthenticated(req, res)

    const teams = await prisma.team.findMany({
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
