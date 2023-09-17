import { Session } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export function ApiMiddleware(req: NextRequest, session: Session | null) {
  if (req.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  if (req.nextUrl.pathname.startsWith('/api')) {
    if (!session) {
      return new NextResponse(null, { status: 401 })
    }
  }
}
