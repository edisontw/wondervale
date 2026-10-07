# Deployment Baseline

## Initial hosting

Wondervale will initially run on the existing **MN4** host while usage is low.

MN4 already hosts unrelated services, so Wondervale should be deployed with minimal assumptions about the machine and no dependency on another MN4 application.

Do not place host IP addresses, credentials, API keys, or unrelated service details in this repository.

## Static-first deployment

The MVP should prefer a static production build served by the existing reverse proxy/web server.

Benefits:

- no dedicated Wondervale Node process required for basic play;
- small operational footprint on a shared host;
- fewer failure modes;
- easy migration to another host/CDN later;
- content and runtime remain tied to the Git build rather than server-local state.

If the selected framework requires a server for a future feature, add it only when that feature is intentionally introduced.

## Deployment principles

- isolated site/document root;
- hostname-based reverse proxy/web serving;
- HTTPS;
- atomic/reversible deployments where practical;
- health/static availability check;
- logs separated from unrelated services;
- no dependency on another MN4 application;
- straightforward backup/export path;
- no irreplaceable application state stored only on MN4.

## Migration requirement

The application should be movable to a dedicated host or CDN later without changing content architecture.

Avoid:

- hard-coded hostnames or IP addresses;
- local filesystem paths embedded in content;
- coupling to another MN4 service database;
- server-only progression state in the early product.

## Early-stage state

Content belongs in Git/build artifacts.

Child/family progress should remain local and versioned until cloud synchronization is intentionally introduced.

## Logging/privacy

Before public launch, review reverse-proxy/web-server logging:

- what identifiers are recorded;
- how long logs are retained;
- who can access them;
- whether third-party scripts add additional collection.

Do not add third-party behavioral analytics by default.

## Public launch checklist

Before announcing a public URL:

- production build passes;
- content validation/lint passes;
- HTTPS works;
- static availability/health check works;
- mobile/touch layout is usable;
- keyboard/accessibility baseline works;
- no debug UI is exposed;
- no secrets are bundled client-side;
- privacy information exists for adults;
- parent-facing explanation is present;
- at least one complete validated playable episode is available.
