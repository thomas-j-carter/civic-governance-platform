import type { CmsAuthenticatedUser } from './role-mapping'
import {
  canAccessCmsAdministrativeSurface,
  canAccessCmsAuthenticatedSurface,
  canAccessCmsEditorialSurface,
} from './role-mapping'

type HeaderLike =
  | Headers
  | Record<string, string | string[] | undefined>
  | undefined
  | null

function readHeader(headers: HeaderLike, key: string): string | null {
  if (!headers) return null

  if (headers instanceof Headers) {
    return headers.get(key)
  }

  const value = headers[key] ?? headers[key.toLowerCase()]
  if (typeof value === 'string') return value
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0]
  return null
}

export function extractCmsUserFromHeaders(
  headers: HeaderLike,
): CmsAuthenticatedUser | null {
  const sub = readHeader(headers, 'x-ardtire-user-id')
  if (!sub) return null

  const email = readHeader(headers, 'x-ardtire-email')
  const name = readHeader(headers, 'x-ardtire-name')
  const preferredUsername = readHeader(headers, 'x-ardtire-preferred-username')
  const rawRoles = readHeader(headers, 'x-ardtire-roles') ?? ''

  const roles = rawRoles
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  return {
    sub,
    email,
    name,
    preferredUsername,
    roles: roles as CmsAuthenticatedUser['roles'],
  }
}

export function extractCmsUserFromPayloadRequest(req: unknown): CmsAuthenticatedUser | null {
  const maybeReq = req as { headers?: HeaderLike } | undefined
  return extractCmsUserFromHeaders(maybeReq?.headers)
}

export function requestIsAuthenticated(req: unknown): boolean {
  return canAccessCmsAuthenticatedSurface(extractCmsUserFromPayloadRequest(req))
}

export function requestIsEditor(req: unknown): boolean {
  return canAccessCmsEditorialSurface(extractCmsUserFromPayloadRequest(req))
}

export function requestIsAdmin(req: unknown): boolean {
  return canAccessCmsAdministrativeSurface(extractCmsUserFromPayloadRequest(req))
}