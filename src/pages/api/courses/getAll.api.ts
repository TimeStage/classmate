import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/middlewares/verify-auth'

export default async function GetAll(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end()
    }
    await isAuthenticated(req, res)

    const course = await prisma.course.findMany()
    res.status(200).json(course)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'error when searching for courses' })
  }
}
