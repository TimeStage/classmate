import { NextApiRequest, NextApiResponse, NextPageContext } from 'next'
import { Adapter } from 'next-auth/adapters'
import { prisma } from '../prisma'
export function PrismaAdapter(
  req: NextApiRequest | NextPageContext['req'],
  res: NextApiResponse | NextPageContext['res'],
): Adapter {
  return {
    async createUser(user) {
      const { email, ...prismaUser } = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })

      return {
        email: email!,
        ...prismaUser,
      }
    },
    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      })
      if (!user) {
        return null
      }

      const { email, ...prismaUser } = user

      return {
        email: user.email!,
        ...prismaUser,
      }
    },
    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })
      if (!user) {
        return null
      }
      const { email: prismaEmail, ...prismaUser } = user
      return {
        email: prismaEmail!,
        ...prismaUser,
      }
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
        include: {
          user: true,
        },
      })
      if (!account) {
        return null
      }
      const {
        user: { email, ...user },
      } = account
      return {
        email: email!,
        ...user,
      }
    },
    async updateUser(user) {
      const prismaUser = await prisma.user.update({
        where: {
          id: user.id!,
        },
        data: {
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })

      const { email, ...userPrisma } = prismaUser

      return {
        email: prismaUser.email!,
        ...userPrisma,
      }
    },
    async linkAccount(account) {
      await prisma.account.create({
        data: {
          userId: account.userId,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        },
      })
    },
    async createSession({ sessionToken, userId, expires }) {
      await prisma.session.create({
        data: {
          userId,
          expires,
          sessionToken,
        },
      })
      return {
        userId,
        sessionToken,
        expires,
      }
    },
    async getSessionAndUser(sessionToken) {
      const prismaSession = await prisma.session.findUnique({
        where: {
          sessionToken,
        },
        include: {
          user: true,
        },
      })

      if (!prismaSession) {
        return null
      }

      const {
        user: { email, ...user },
        ...session
      } = prismaSession

      return {
        session: {
          userId: session.userId,
          expires: session.expires,
          sessionToken: session.sessionToken,
        },
        user: {
          email: email!,
          ...user,
        },
      }
    },
    async updateSession({ sessionToken, userId, expires }) {
      const prismaSession = await prisma.session.update({
        where: {
          sessionToken,
        },
        data: {
          expires,
          userId,
        },
      })
      return {
        expires: prismaSession.expires,
        sessionToken: prismaSession.sessionToken,
        userId: prismaSession.userId,
      }
    },
    async deleteSession(sessionToken) {
      await prisma.session.delete({
        where: {
          sessionToken,
        },
      })
    },
  }
}
