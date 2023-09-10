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
        error: 'Course ID not provided',
      })
    }

    const course = await prisma.course.findUnique({
      where: {
        id,
      },
    })

    if (!course) {
      return res.status(404).json({
        error: 'Course not found',
      })
    }

    const teams = await prisma.team.findMany({
      where: {
        courseId: course.id,
      },
    })

    return res.status(200).json(teams)
  } catch (error) {
    return res.status(500)
  }
}
