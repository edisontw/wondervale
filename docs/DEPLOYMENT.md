# Deployment Baseline

## Initial hosting

Wondervale will initially run on the existing **MN4** host while usage is low.

MN4 already hosts unrelated services, so Wondervale should be deployed as an isolated application with minimal assumptions about the machine.

Do not place host IP addresses, credentials, API keys, or unrelated service details in this repository.

## Deployment principles

- one application directory/service boundary;
- its own environment configuration;
- reverse proxy by hostname;
- HTTPS;
- explicit application port;
- restart policy;
- health endpoint;
- logs separated from other services;
- no dependency on another MN4 application;
- straightforward backup/export path.

## Migration requirement

The application should be movable to a dedicated host later without changing content or application architecture.

Avoid:

- hard-coded hostnames or IP addresses;
- local filesystem paths embedded in content;
- coupling to another MN4 service database;
- storing irreplaceable state only on the server.

## Early-stage state

The first release should minimize server-side state. Content belongs in Git. Child/family progress should remain local until cloud synchronization is intentionally introduced.

## Public launch checklist

Before announcing a public URL:

- production build passes;
- HTTPS works;
- health endpoint works;
- mobile layout is usable;
- no debug UI is exposed;
- no secrets are bundled client-side;
- basic privacy statement exists;
- parent-facing explanation is present;
- at least one complete playable episode is available.
