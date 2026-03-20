import { jwtVerify, SignJWT } from 'jose'
import type { CmsAuthenticatedUser } from '../role-mapping'

export const CMS_SESSION_COOKIE_NAME = 'ardtire-cms-auth'
export const CMS_LOGIN_STATE_COOKIE_NAME = 'ardtire-cms-login-state'
export const CMS_POST_LOGIN_REDIRECT_COOKIE_NAME = 'ardtire-cms-post-login-redirect'

export interface CmsAuthSessionData {
  user: CmsAuthenticatedUser
  refreshToken: string | null
  refreshTokenExpiresAt: number | null
  idToken: string | null
}

function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    throw new Error('SESSION_SECRET is required.')
  }

  return new TextEncoder().encode(secret)
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 8,
  }
}

export function getTransientCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 10,
  }
}

export async function encodeCmsAuthSession(
  data: CmsAuthSessionData,
): Promise<string> {
  return new SignJWT({
    user: data.user,
    refreshToken: data.refreshToken,
    refreshTokenExpiresAt: data.refreshTokenExpiresAt,
    idToken: data.idToken,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getSessionSecret())
}

export async function decodeCmsAuthSession(
  cookieValue: string | undefined,
): Promise<CmsAuthSessionData | null> {
  if (!cookieValue) return null

  try {
    const { payload } = await jwtVerify(cookieValue, getSessionSecret())

    const user = payload.user as CmsAuthenticatedUser | undefined
    if (!user?.sub) {
      return null
    }

    return {
      user,
      refreshToken:
        typeof payload.refreshToken === 'string' ? payload.refreshToken : null,
      refreshTokenExpiresAt:
        typeof payload.refreshTokenExpiresAt === 'number'
          ? payload.refreshTokenExpiresAt
          : null,
      idToken: typeof payload.idToken === 'string' ? payload.idToken : null,
    }
  } catch {
    return null
  }
}

export function isCmsAuthSessionExpired(
  session: CmsAuthSessionData | null,
): boolean {
  if (!session) return true

  if (
    typeof session.refreshTokenExpiresAt === 'number' &&
    Date.now() >= session.refreshTokenExpiresAt
  ) {
    return true
  }

  return false
}