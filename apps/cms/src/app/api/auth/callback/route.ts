import { NextResponse } from 'next/server'
import {
  CMS_LOGIN_STATE_COOKIE_NAME,
  CMS_POST_LOGIN_REDIRECT_COOKIE_NAME,
  CMS_SESSION_COOKIE_NAME,
  encodeCmsAuthSession,
  getSessionCookieOptions,
  getTransientCookieOptions,
} from '../../../../lib/auth/session'
import { exchangeCmsAuthorizationCode } from '../../../../lib/keycloak'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  const response = NextResponse.redirect(new URL('/admin', request.url))

  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = Object.fromEntries(
    cookieHeader
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf('=')
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))]
      }),
  )

  const expectedState = cookies[CMS_LOGIN_STATE_COOKIE_NAME]
  const redirectTo = cookies[CMS_POST_LOGIN_REDIRECT_COOKIE_NAME] || '/admin'

  if (!code || !state || !expectedState || state !== expectedState) {
    response.cookies.set(CMS_LOGIN_STATE_COOKIE_NAME, '', {
      ...getTransientCookieOptions(),
      maxAge: 0,
    })
    response.cookies.set(CMS_POST_LOGIN_REDIRECT_COOKIE_NAME, '', {
      ...getTransientCookieOptions(),
      maxAge: 0,
    })
    response.headers.set('location', '/')
    return response
  }

  const sessionPayload = await exchangeCmsAuthorizationCode(code)
  const sessionCookie = await encodeCmsAuthSession(sessionPayload)

  response.cookies.set(CMS_SESSION_COOKIE_NAME, sessionCookie, getSessionCookieOptions())
  response.cookies.set(CMS_LOGIN_STATE_COOKIE_NAME, '', {
    ...getTransientCookieOptions(),
    maxAge: 0,
  })
  response.cookies.set(CMS_POST_LOGIN_REDIRECT_COOKIE_NAME, '', {
    ...getTransientCookieOptions(),
    maxAge: 0,
  })
  response.headers.set('location', redirectTo)

  return response
}