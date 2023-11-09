import { Role } from '@prisma/client'
import { Session } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export function PagesMiddleware(req: NextRequest, session: Session | null) {
  if (
    !req.nextUrl.pathname.includes('/api') &&
    !(session?.user.role === Role.ADMIN)
  ) {
    if (!session) {
      if (req.nextUrl.pathname !== '/') {
        return NextResponse.redirect(new URL('/', req.url))
      }
      return NextResponse.next()
    }

    if (!session.user.teamId) {
      if (req.nextUrl.pathname !== '/register/form-step') {
        return NextResponse.redirect(new URL('/register/form-step', req.url))
      }
    }

    if (
      !!session.user.teamId &&
      req.nextUrl.pathname === '/register/form-step'
    ) {
      return NextResponse.redirect(new URL('/home', req.url))
    }

    if (req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/home', req.url))
    }
  }
}
