import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  CMS_SESSION_COOKIE_NAME,
  decodeCmsAuthSession,
  isCmsAuthSessionExpired,
} from './lib/auth/session'
import { canAccessCmsEditorialSurface } from './lib/role-mapping'

function isProtectedPath(pathname: string): boolean {
  return pathname.startsWith('/admin') || pathname.startsWith('/api/payload')
}

function isPayloadApiPath(pathname: string): boolean {
  return pathname.startsWith('/api/payload')
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get(CMS_SESSION_COOKIE_NAME)?.value
  const session = await decodeCmsAuthSession(sessionCookie)

  if (!session || isCmsAuthSessionExpired(session)) {
    if (isPayloadApiPath(pathname)) {
      return NextResponse.json(
        {
          code: 'UNAUTHORIZED',
          message: 'CMS authentication is required.',
        },
        { status: 401 },
      )
    }

    const loginUrl = new URL('/api/auth/login', request.url)
    loginUrl.searchParams.set('redirect', `${pathname}${search}`)

    return NextResponse.redirect(loginUrl)
  }

  if (!canAccessCmsEditorialSurface(session.user)) {
    if (isPayloadApiPath(pathname)) {
      return NextResponse.json(
        {
          code: 'FORBIDDEN',
          message: 'You do not have editorial access.',
        },
        { status: 403 },
      )
    }

    return NextResponse.redirect(new URL('/', request.url))
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-ardtire-user-id', session.user.sub)
  requestHeaders.set('x-ardtire-email', session.user.email ?? '')
  requestHeaders.set('x-ardtire-name', session.user.name ?? '')
  requestHeaders.set(
    'x-ardtire-preferred-username',
    session.user.preferredUsername ?? '',
  )
  requestHeaders.set('x-ardtire-roles', session.user.roles.join(','))

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ['/admin/:path*', '/api/payload/:path*'],
}