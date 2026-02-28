# Perf + reliability rules

- All outbound HTTP:
  - Timeout per request
  - CancellationToken wired through
  - Retry ONLY for safe idempotent calls (and never infinite)
- Redis:
  - Cache calls get a small time budget (fail fast)
  - Stampede protection for hot keys (singleflight or equivalent)
  - TTL jitter for large fleets
- Logging:
  - Avoid high-cardinality fields
  - Avoid expensive structured logs in hot paths
