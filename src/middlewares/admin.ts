import { Session } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export function AdminMiddleware(req: NextRequest, session: Session | null) {
  if (req.nextUrl.pathname.includes('/admin')) {
    if (session?.user.role === 'ADMIN') {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/home', req.url))
  }
}
