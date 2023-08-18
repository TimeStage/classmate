import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

export async function isAuthenticated(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) {
    return res.status(401).end()
  }
}
