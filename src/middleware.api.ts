import { getSession } from 'next-auth/react'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const session = await getSession({
    req: {
      headers: {
        cookie: req.headers.get('cookie') ?? undefined,
      },
    },
  })

  if (req.nextUrl.pathname.startsWith('/api/auth')) {
    return
  }

  if (req.nextUrl.pathname.startsWith('/api')) {
    if (!session) {
      return new NextResponse(null, { status: 401 })
    }
  }

  if (req.nextUrl.pathname.includes('/admin')) {
    if (session?.user.role === 'ADMIN') {
      return
    }
    return NextResponse.redirect(new URL('/home', req.url))
  } else {
    if (!req.nextUrl.pathname.includes('/api')) {
      if (!session) {
        if (req.nextUrl.pathname !== '/') {
          return NextResponse.redirect(new URL('/', req.url))
        }
        return
      }

      if (!session.user.teamId) {
        if (req.nextUrl.pathname !== '/register/form-step') {
          console.log(req.nextUrl.pathname)

          console.log(session)

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
