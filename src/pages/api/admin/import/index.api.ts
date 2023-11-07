import { NextApiRequest, NextApiResponse } from 'next'
import { importExcelRequestSchema } from '@/validators/admin'

import { upsertData } from './functions/upsert-data'

export default async function ImportExcel(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end()
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
