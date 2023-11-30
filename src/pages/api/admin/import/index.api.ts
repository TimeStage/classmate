import { NextApiRequest, NextApiResponse } from 'next'
import { importExcelRequestSchema } from '@/validators/admin'

import { upsertData } from './functions/upsert-data'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

export default async function ImportExcel(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'OPTIONS' && req.method !== 'POST') {
      return res.status(405).end()
    }

    const session = await getServerSession(
      req,
      res,
      buildNextAuthOptions(req, res),
    )

    if (!session || session.user.role !== 'ADMIN') {
      return res.status(401).end()
    }

    const { courses } = importExcelRequestSchema.parse(req.body)

    await upsertData(courses)

    return res.status(201).end()
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      error,
    })
  }
}
