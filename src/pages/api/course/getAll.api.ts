import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'

export default async function GetAll(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'OPTIONS' && req.method !== 'GET') {
      return res.status(405)
    }

    const session = await getServerSession(
      req,
      res,
      buildNextAuthOptions(req, res),
    )

    if (!session) {
      return res.status(401).end()
    }

    const course = await prisma.course.findMany()
    res.status(200).json(course)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'error when searching for courses' })
  }
}
