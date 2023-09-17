import { getSession } from 'next-auth/react'
import { NextRequest, NextResponse } from 'next/server'
import { PagesMiddleware } from './middlewares/pages'
import { AdminMiddleware } from './middlewares/admin'
import { ApiMiddleware } from './middlewares/api'

export async function middleware(req: NextRequest) {
  const session = await getSession({
    req: {
      headers: {
        cookie: req.headers.get('cookie') ?? undefined,
      },
    },
  })

  let NextResponse: NextResponse | undefined

  NextResponse = ApiMiddleware(req, session)

  NextResponse = AdminMiddleware(req, session)

  NextResponse = PagesMiddleware(req, session)

  return NextResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
