<!-- Summary: How a package ships one export with a different client and server implementation, via the `$rime/modules` barrel. -->

A package's `src/lib` runs in two different builds — client and server. `$rime/modules` lets one export resolve to a different file per build, so code needing real server access (a database, a secret) never ships to the browser.

## Different behavior per side

A field's `beforeValidate` hook runs on both sides by default — the same function, once. Override it in `module.server.ts` when the server needs to do more than the client can (or should). A link field is a good example: both sides should normalize a bare domain into a full URL as the user types, but only the server can safely check it against a blocklist — that list has no business shipping in client JS, and the check only means anything if it can't be bypassed by calling the API directly.

1. Normalize the URL in `module.ts`. This shared version runs on the client for immediate feedback, and on the server too — unless overridden:

   ```ts
   // @file:src/lib/my-link-field/module.ts
   export const normalizeUrl: FieldHookShared = (value) => {
     if (value.type !== 'url' || !value.value) return value;
     const hasProtocol = /^https?:\/\//i.test(value.value);
     return hasProtocol ? value : { ...value, value: `https://${value.value}` };
   };
   ```

2. Override it in `module.server.ts`: reuse that same normalization, then add the server-only check on top:

   ```ts
   // @file:src/lib/my-link-field/module.server.ts
   import { normalizeUrl as normalizeUrlBase } from './module.js';

   const BLOCKED_HOSTS = ['known-spam-domain.com'];

   export const normalizeUrl: FieldHookShared = (value, ctx) => {
     const normalized = normalizeUrlBase(value);
     if (normalized.type === 'url' && normalized.value) {
       const { hostname } = new URL(normalized.value);
       if (BLOCKED_HOSTS.includes(hostname)) {
         throw new Error(`${hostname} is not allowed`);
       }
     }
     return normalized;
   };
   ```

3. Wire it into the field, same as any other export:

   ```ts
   // @file:src/lib/index.ts
   import { normalizeUrl } from '$rime/modules';

   const linkField = link('normalized').beforeValidate(normalizeUrl)
   ```

## Server-only, hidden from the client bundle

No `module.ts` — just the server file. Its code and imports never reach the browser.

1. Write the code in `module.server.ts` only:

   ```ts
   // @file:src/lib/my-thing/module.server.ts
   import { SECRET_API_KEY } from '$env/static/private';

   export const callExternalApi = async () =>
     fetch('https://api.example.com', { headers: { Authorization: SECRET_API_KEY } });
   ```

2. Import it from `$rime/modules`, same as any split export:

   ```ts
   // @file:src/lib/index.ts
   import { callExternalApi } from '$rime/modules';
   ```


> [!INFO] Every `module(.server).ts` export name must be unique across the whole package.

[resource:pages:Authoring a package](/docs/06-guides/04-authoring-a-package.md)

[resource:pages:Plugin authoring](/docs/06-guides/03-plugin-authoring.md)
