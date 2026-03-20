# REPO CONSTRAINTS

## Layering
- domain: pure rules/entities
- application: orchestration
- infrastructure: repository implementations
- routes: transport only

## Forbidden
- direct DB access from routes
- business logic in controllers
- implicit transitions
