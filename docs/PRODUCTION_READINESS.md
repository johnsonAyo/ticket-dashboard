# Production Readiness & Hardening

This document outlines the current architectural decisions and the necessary hardening required before a production deployment. It focuses exclusively on strengthening existing foundations.

## 1. Current State Assumptions

These simplifying decisions were intentionally made for the scope of the current build:

- **Database:** SQLite on local disk, suitable for single-process environments.
- **Architecture:** Single-instance API.
- **API Design:** Full result sets returned for queries, optimizing for simple client integration.
- **Security:** Permissive CORS for ease of review.
- **Observability:** Human-readable stdout request logs with timing (via a global interceptor).

## 2. Hardening Priorities

To transition the application to a production-ready state, the following foundational gaps should be addressed:

### Database & Data Model

- **PostgreSQL:** Move from SQLite to a managed PostgreSQL instance for concurrent processing, connection pooling, and automated backups.
- **Indexing:** Add database indexes to columns used for filtering and sorting (e.g., `status`, `priority`, `createdAt`) to maintain query performance at scale.

### API Stability

- **Pagination:** Implement cursor-based pagination on list endpoints to handle large data volumes efficiently.
- **Rate Limiting:** Enforce API rate limiting and strict payload size limits to protect against abuse.

### Observability

- **Structured Logging:** Move from human-readable stdout logs to JSON structured logging with request correlation IDs, shipped to a central platform (e.g., Datadog, Loki).
- **Metrics & Tracing:** Add OpenTelemetry metrics and distributed tracing exported to an external provider (e.g., Datadog APM, Prometheus + Grafana) with SLO dashboards and alert routing to Slack/PagerDuty.

### Security & Reliability

- **Network Security:** Implement a strict CORS allowlist and standard security headers (e.g., via `helmet`).
- **Secret Management:** Transition environment variables to a secure secret manager.
- **Horizontal Scaling:** Deploy the application as a stateless service behind a load balancer, adding readiness and liveness probes for orchestration health checks.
