import { NextResponse } from 'next/server'
import {
  CMS_SESSION_COOKIE_NAME,
  decodeCmsAuthSession,
  getSessionCookieOptions,
} from '../../../../lib/auth/session'
import { createCmsLogoutUrl } from '../../../../lib/keycloak'

export async function GET(request: Request) {
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

  const session = await decodeCmsAuthSession(cookies[CMS_SESSION_COOKIE_NAME])
  const logoutUrl = await createCmsLogoutUrl(session?.idToken ?? null)

  const response = NextResponse.redirect(logoutUrl)
  response.cookies.set(CMS_SESSION_COOKIE_NAME, '', {
    ...getSessionCookieOptions(),
    maxAge: 0,
  })

  return response
}