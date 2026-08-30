<!-- Summary: How a package ships one export with a different client and server implementation, via the `$rime/modules` barrel. -->

A package's `src/lib` runs in two different builds — client and server. `$rime/modules` lets one export resolve to a different file per build, so code needing real server access (a database, a secret) never ships to the browser.

## Different behavior per side

```ts
// @file:src/lib/my-thing/module.ts
export const trackVisit = async (path: string) => {
  // client: no-op
};
```

```ts
// @file:src/lib/my-thing/module.server.ts
import { Hooks } from '$rime/config';
import { SECRET_TOKEN } from '$env/static/private';

export const trackVisit = Hooks.beforeRead(async (args) => {
  const { event } = args;
  const path = event.url.pathname;
  await fetch(`https://analytics.example.com/track?token=${SECRET_TOKEN}`, {
    method: 'POST',
    body: JSON.stringify({ path })
  });
  return args;
});
```

```ts
// @file:src/lib/index.ts
import { trackVisit } from '$rime/modules';
```

## Server-only, hidden from the client bundle

No `module.ts` — just the server file. Its code and imports never reach the browser.

```ts
// @file:src/lib/my-thing/module.server.ts
import { SECRET_API_KEY } from '$env/static/private';

export const callExternalApi = async () =>
  fetch('https://api.example.com', { headers: { Authorization: SECRET_API_KEY } });
```

```ts
// @file:src/lib/index.ts
import { callExternalApi } from '$rime/modules';
```

## Rules

- Import by name from `$rime/modules` — never `$rime/modules/my-thing`.
- Every `module(.server).ts` export name must be unique across the whole package.

[resource:pages:Authoring a package](/docs/06-guides/04-authoring-a-package.md).

[resource:pages:Plugin authoring](/docs/06-guides/03-plugin-authoring.md).
