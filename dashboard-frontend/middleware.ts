import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionFromCookieHeader } from '@/lib/auth-session'

const publicRoutes = new Set(['/login', '/error'])

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await getSessionFromCookieHeader(request.headers.get('cookie'))
  const isPublicRoute = publicRoutes.has(pathname)

  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (isPublicRoute) {
    return NextResponse.next()
  }

  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
      Protect all routes except:
      - api
      - _next
      - static files
    */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}