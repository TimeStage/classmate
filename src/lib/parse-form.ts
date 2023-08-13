import formidable from 'formidable'
import type { NextApiRequest } from 'next'

export const parseForm = async (
  req: NextApiRequest,
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    resolve({
      files: {},
      fields: {},
    })
  })
}
