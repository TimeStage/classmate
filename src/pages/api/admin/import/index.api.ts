import { isAuthenticated } from '@/middlewares/verify-auth-admin'
import { Fields, Formidable } from 'formidable'
import { NextApiRequest, NextApiResponse } from 'next'
import Excel from 'exceljs'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function ImportFile(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end()
    }

    /* Get files using formidable */
    const data: Fields = await new Promise((resolve, reject) => {
      const form = new Formidable()

      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve(fields)
      })
    })

    const workbook = new Excel.Workbook()
    await workbook.xlsx.load(data.file[0])

    await isAuthenticated(req, res)
    return res.status(200).end()
  } catch (error) {
    console.log(error)

    return res.status(500).json({ error })
  }
}
