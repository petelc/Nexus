# API conventions (Minimal APIs) ---> Depending on your setup

- Prefer Minimal APIs (`MapGet/MapPost`) over controllers.
- Endpoints must accept CancellationToken.
- Use FastEndpoints for validation, error handling, and OpenAPI docs.
- Validate inputs early. Return ProblemDetails for errors.
- For outbound calls: use IHttpClientFactory + timeouts.
- For "slow work": queue it (don't run it in the request).
