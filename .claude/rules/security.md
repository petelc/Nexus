# Security rules

- No secrets in code or CLAUDE.md.
- Avoid putting sensitive IDs/tokens in query strings.
- Auth must be explicit on endpoints (no accidental public routes).
- CORS must be restrictive (no AllowAnyOrigin in prod configs).
