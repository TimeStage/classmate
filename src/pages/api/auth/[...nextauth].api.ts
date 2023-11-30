import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@/lib/auth/prisma-adapter'
import { NextApiRequest, NextApiResponse, NextPageContext } from 'next'

export function buildNextAuthOptions(
  req: NextApiRequest | NextPageContext['req'],
  res: NextApiResponse | NextPageContext['res'],
): NextAuthOptions {
  return {
    adapter: PrismaAdapter(req, res),
    secret: String(process.env.NEXTAUTH_SECRET),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_SECRET_ID!,
      }),
    ],
    pages: {
      signIn: '/',
    },

    callbacks: {
      async jwt({ token, account, user }) {
        return { ...token }
      },

      async signIn({ account, user }) {
        if (
          account?.provider === 'google' &&
          user.email?.endsWith('sed.sc.gov.br')
        ) {
          return true
        }
        return '/'
      },

      async session({ session, user }) {
        return {
          ...session,
          user,
        }
      },
    },
  }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, buildNextAuthOptions(req, res))
}
