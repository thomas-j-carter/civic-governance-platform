import type { AppRole } from '@ardtire/authz'
import { appRoles } from '@ardtire/authz'

export interface CmsAuthenticatedUser {
  sub: string
  email: string | null
  name: string | null
  preferredUsername: string | null
  roles: AppRole[]
}

export function mapKeycloakClaimsToCmsUser(
  claims: Record<string, unknown>,
): CmsAuthenticatedUser {
  const validRoles = new Set<string>(appRoles)

  const realmRoles = Array.isArray((claims.realm_access as { roles?: unknown[] } | undefined)?.roles)
    ? ((claims.realm_access as { roles?: unknown[] }).roles ?? [])
    : []

  const resourceRolesObject =
    (claims.resource_access as Record<string, { roles?: unknown[] }> | undefined) ?? {}
  const resourceRoles = Object.values(resourceRolesObject).flatMap((entry) =>
    Array.isArray(entry.roles) ? entry.roles : [],
  )

  const mergedRoles = [...realmRoles, ...resourceRoles].filter(
    (value): value is string => typeof value === 'string' && validRoles.has(value),
  )

  return {
    sub: typeof claims.sub === 'string' ? claims.sub : '',
    email: typeof claims.email === 'string' ? claims.email : null,
    name: typeof claims.name === 'string' ? claims.name : null,
    preferredUsername:
      typeof claims.preferred_username === 'string' ? claims.preferred_username : null,
    roles: Array.from(new Set(mergedRoles)) as AppRole[],
  }
}

export function canAccessCmsAuthenticatedSurface(
  user: CmsAuthenticatedUser | null | undefined,
): boolean {
  return Boolean(user?.sub)
}

export function canAccessCmsEditorialSurface(
  user: CmsAuthenticatedUser | null | undefined,
): boolean {
  if (!user) return false

  return user.roles.some((role) => ['editor', 'admin', 'founder'].includes(role))
}

export function canAccessCmsAdministrativeSurface(
  user: CmsAuthenticatedUser | null | undefined,
): boolean {
  if (!user) return false

  return user.roles.some((role) => ['admin', 'founder'].includes(role))
}