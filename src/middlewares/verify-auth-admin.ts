import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import { admins } from '@/utils/admins'
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

  if (!admins.includes(session.user?.email ?? '')) {
    return res.status(401).end()
  }
}
