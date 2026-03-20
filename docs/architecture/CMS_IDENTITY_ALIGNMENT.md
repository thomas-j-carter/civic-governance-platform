# CMS_IDENTITY_ALIGNMENT

## Document Status
- Status: Canonical working baseline
- Purpose: define how the CMS aligns to the same identity source and role vocabulary as the web app and governance API
- Audience: platform engineers, CMS implementers, future AI implementation agents

---

## 1. Why This Document Exists

The Ardtire platform must not fragment into:
- one identity system for the web app
- another for the governance API
- another for the CMS/editorial surface

The CMS must align to the same Keycloak-based identity model and the same canonical application role vocabulary.

---

## 2. Core Principle

Keycloak is the authoritative identity provider across the platform.

The CMS must use:
- the same external identity source
- the same canonical recognized roles
- a request boundary that translates authenticated identity into editorial access decisions

The CMS must not become a shadow identity system.

---

## 3. Canonical Editorial Roles

The CMS should recognize these roles for editorial/admin access:

- `editor`
- `admin`
- `founder`

Other roles may exist in tokens, but they should not automatically grant editorial control unless explicitly mapped.

---

## 4. CMS Access Model

The current CMS convergence approach is:

1. user authenticates against Keycloak
2. CMS establishes its own app session
3. Next middleware protects `/admin` and `/api/payload/*`
4. middleware forwards normalized user identity and roles in request headers
5. Payload access functions read those forwarded headers
6. editorial/admin collections enforce access from the canonical role map

This creates one identity source and one role vocabulary while keeping the CMS boundary clean.

---

## 5. Important Boundary

Payload’s internal `Users` collection may continue to exist for compatibility and content administration purposes, but it is not the primary source of identity truth.

Identity truth is:
- Keycloak for authentication and role issuance
- application code for recognized role mapping and access rules

---

## 6. Summary

The CMS must converge on:
- Keycloak-based sign-in
- app-session-backed CMS access
- canonical role mapping
- forwarded request identity for Payload access checks

This avoids a parallel editorial auth system diverging from the rest of the platform.