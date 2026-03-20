import { NextResponse } from 'next/server'
import {
  CMS_LOGIN_STATE_COOKIE_NAME,
  CMS_POST_LOGIN_REDIRECT_COOKIE_NAME,
  getTransientCookieOptions,
} from '../../../../lib/auth/session'
import {
  createCmsAuthorizationUrl,
  createCmsLoginState,
} from '../../../../lib/keycloak'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const redirectTo = url.searchParams.get('redirect') || '/admin'
  const state = createCmsLoginState()
  const authorizationUrl = await createCmsAuthorizationUrl(state)

  const response = NextResponse.redirect(authorizationUrl)
  response.cookies.set(CMS_LOGIN_STATE_COOKIE_NAME, state, getTransientCookieOptions())
  response.cookies.set(
    CMS_POST_LOGIN_REDIRECT_COOKIE_NAME,
    redirectTo,
    getTransientCookieOptions(),
  )

  return response
}