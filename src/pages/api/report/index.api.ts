import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'
import { createNewReportSchema } from '@/validators/createNewReport'

export default async function GetAll(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'OPTIONS' && req.method !== 'POST') {
      return res.status(405)
    }

    const { description, userId } = createNewReportSchema.parse(req.body)

    const session = await getServerSession(
      req,
      res,
      buildNextAuthOptions(req, res),
    )

    if (!session) {
      return res.status(401).end()
    }

    const report = await prisma.report.create({
      data: {
        description,
        userId,
      },
    })
    res.status(200).json(report)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'error on create report' })
  }
}
