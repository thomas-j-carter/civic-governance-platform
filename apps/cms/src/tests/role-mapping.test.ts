import { describe, expect, test } from 'vitest'
import {
  canAccessCmsAdministrativeSurface,
  canAccessCmsAuthenticatedSurface,
  canAccessCmsEditorialSurface,
  mapKeycloakClaimsToCmsUser,
} from '../lib/role-mapping'

describe('cms role mapping', () => {
  test('maps recognized roles from claims', () => {
    const user = mapKeycloakClaimsToCmsUser({
      sub: 'user_1',
      email: 'editor@example.com',
      realm_access: {
        roles: ['editor', 'unknown_role'],
      },
    })

    expect(user.sub).toBe('user_1')
    expect(user.roles).toEqual(['editor'])
  })

  test('editor can access editorial surface', () => {
    expect(
      canAccessCmsEditorialSurface({
        sub: 'user_1',
        email: 'editor@example.com',
        name: 'Editor',
        preferredUsername: 'editor',
        roles: ['editor'],
      }),
    ).toBe(true)
  })

  test('admin can access administrative surface', () => {
    expect(
      canAccessCmsAdministrativeSurface({
        sub: 'user_1',
        email: 'admin@example.com',
        name: 'Admin',
        preferredUsername: 'admin',
        roles: ['admin'],
      }),
    ).toBe(true)
  })

  test('plain member cannot access editorial surface', () => {
    expect(
      canAccessCmsEditorialSurface({
        sub: 'user_1',
        email: 'member@example.com',
        name: 'Member',
        preferredUsername: 'member',
        roles: ['member'],
      }),
    ).toBe(false)
  })

  test('any authenticated user passes authenticated-surface check', () => {
    expect(
      canAccessCmsAuthenticatedSurface({
        sub: 'user_1',
        email: 'user@example.com',
        name: 'User',
        preferredUsername: 'user',
        roles: [],
      }),
    ).toBe(true)
  })
})