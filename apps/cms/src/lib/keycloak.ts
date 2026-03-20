import { randomUUID } from 'node:crypto'
import { decodeJwt } from 'jose'
import { mapKeycloakClaimsToCmsUser, type CmsAuthenticatedUser } from './role-mapping'

interface KeycloakDiscoveryDocument {
  authorization_endpoint: string
  token_endpoint: string
  end_session_endpoint?: string
}

interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  refresh_expires_in?: number
  id_token?: string
  token_type: string
}

export interface CmsKeycloakSessionPayload {
  user: CmsAuthenticatedUser
  refreshToken: string | null
  refreshTokenExpiresAt: number | null
  idToken: string | null
}

let discoveryCache: KeycloakDiscoveryDocument | null = null

function getIssuer(): string {
  const issuer = process.env.KEYCLOAK_ISSUER
  if (!issuer) throw new Error('KEYCLOAK_ISSUER is required.')
  return issuer
}

function getClientId(): string {
  const clientId = process.env.KEYCLOAK_CLIENT_ID || 'ardtire-cms'
  return clientId
}

function getClientSecret(): string {
  const secret = process.env.KEYCLOAK_WEB_CLIENT_SECRET
  if (!secret) throw new Error('KEYCLOAK_WEB_CLIENT_SECRET is required.')
  return secret
}

function getCmsBaseUrl(): string {
  const baseUrl = process.env.CMS_BASE_URL
  if (!baseUrl) throw new Error('CMS_BASE_URL is required.')
  return baseUrl
}

export function getCmsCallbackUrl(): string {
  return `${getCmsBaseUrl()}/api/auth/callback`
}

export function getCmsPostLogoutRedirectUrl(): string {
  return `${getCmsBaseUrl()}/`
}

async function getDiscoveryDocument(): Promise<KeycloakDiscoveryDocument> {
  if (discoveryCache) {
    return discoveryCache
  }

  const response = await fetch(`${getIssuer()}/.well-known/openid-configuration`)
  if (!response.ok) {
    throw new Error(`Failed to load Keycloak discovery document: ${response.status}`)
  }

  const json = (await response.json()) as KeycloakDiscoveryDocument
  discoveryCache = json
  return json
}

export function createCmsLoginState(): string {
  return randomUUID()
}

export async function createCmsAuthorizationUrl(state: string): Promise<string> {
  const discovery = await getDiscoveryDocument()
  const url = new URL(discovery.authorization_endpoint)

  url.searchParams.set('client_id', getClientId())
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'openid profile email')
  url.searchParams.set('redirect_uri', getCmsCallbackUrl())
  url.searchParams.set('state', state)

  return url.toString()
}

export async function exchangeCmsAuthorizationCode(
  code: string,
): Promise<CmsKeycloakSessionPayload> {
  const discovery = await getDiscoveryDocument()

  const body = new URLSearchParams()
  body.set('grant_type', 'authorization_code')
  body.set('code', code)
  body.set('client_id', getClientId())
  body.set('client_secret', getClientSecret())
  body.set('redirect_uri', getCmsCallbackUrl())

  const response = await fetch(discovery.token_endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Failed to exchange Keycloak authorization code: ${text}`)
  }

  const tokenResponse = (await response.json()) as TokenResponse
  const claims = decodeJwt(tokenResponse.access_token)

  return {
    user: mapKeycloakClaimsToCmsUser(claims),
    refreshToken: tokenResponse.refresh_token ?? null,
    refreshTokenExpiresAt:
      typeof tokenResponse.refresh_expires_in === 'number'
        ? Date.now() + tokenResponse.refresh_expires_in * 1000
        : null,
    idToken: tokenResponse.id_token ?? null,
  }
}

export async function createCmsLogoutUrl(idTokenHint?: string | null): Promise<string> {
  const discovery = await getDiscoveryDocument()
  const endSessionEndpoint =
    discovery.end_session_endpoint ?? `${getIssuer()}/protocol/openid-connect/logout`

  const url = new URL(endSessionEndpoint)
  url.searchParams.set('client_id', getClientId())
  url.searchParams.set('post_logout_redirect_uri', getCmsPostLogoutRedirectUrl())

  if (idTokenHint) {
    url.searchParams.set('id_token_hint', idTokenHint)
  }

  return url.toString()
}