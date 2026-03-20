import { describe, expect, test } from 'vitest'
import {
  extractCmsUserFromHeaders,
  requestIsAdmin,
  requestIsAuthenticated,
  requestIsEditor,
} from '../lib/request-auth'

describe('cms request auth helpers', () => {
  test('extracts cms user from forwarded headers', () => {
    const user = extractCmsUserFromHeaders(
      new Headers({
        'x-ardtire-user-id': 'user_1',
        'x-ardtire-email': 'editor@example.com',
        'x-ardtire-name': 'Editor Example',
        'x-ardtire-preferred-username': 'editor',
        'x-ardtire-roles': 'editor,admin',
      }),
    )

    expect(user).not.toBeNull()
    expect(user?.sub).toBe('user_1')
    expect(user?.roles).toEqual(['editor', 'admin'])
  })

  test('editor request passes editor check', () => {
    const req = {
      headers: new Headers({
        'x-ardtire-user-id': 'user_1',
        'x-ardtire-roles': 'editor',
      }),
    }

    expect(requestIsEditor(req)).toBe(true)
    expect(requestIsAdmin(req)).toBe(false)
    expect(requestIsAuthenticated(req)).toBe(true)
  })

  test('admin request passes admin check', () => {
    const req = {
      headers: new Headers({
        'x-ardtire-user-id': 'user_1',
        'x-ardtire-roles': 'admin',
      }),
    }

    expect(requestIsAdmin(req)).toBe(true)
  })

  test('missing headers fail access checks', () => {
    const req = {
      headers: new Headers(),
    }

    expect(requestIsAuthenticated(req)).toBe(false)
    expect(requestIsEditor(req)).toBe(false)
    expect(requestIsAdmin(req)).toBe(false)
  })
})