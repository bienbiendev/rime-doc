<!-- Summary: How to build a plugin — collections, routes, actions, request handler, and panel UI a consumer app installs like any dependency. -->

A plugin is a `definePlugin()` factory a consumer passes into their config's `plugins: []`. It returns an object with up to five fields, all optional except `name`:

| Field | Purpose |
| --- | --- |
| `name` | Key under which `actions` is exposed, e.g. `event.locals.rime.<name>` |
| `configure` | `(config) => config` — add collections, fields, panel UI to the app config |
| `routes` | Custom API routes, keyed by exact pathname |
| `actions` | Functions exposed at `event.locals.rime.<name>.<action>` |
| `handler` | A SvelteKit `Handle` that runs on every request |

> [!INFO] This is unrelated to better-auth's own `$auth.plugins` covered in [Configuration](/docs/03-configuration/00-overview.md).

1. Define your plugin

    ```ts
    // @file:src/lib/plugin/module.server.ts
    import { definePlugin } from 'rimecms';
    import type { Plugin } from 'rimecms/types';
    import { json } from '@sveltejs/kit';

    export const myPlugin = definePlugin((options?: { greeting?: string }): Plugin => {
      const message = options?.greeting ?? 'pong';

      return {
        name: 'myPlugin',
        configure: (config) => ({ ...config }),
        routes: { '/api/my-plugin/ping': { GET: () => json({ message }) } },
        actions: { ping: () => message },
        handler: async ({ event, resolve }) => resolve(event)
      };
    });
    ```

2. Define the client version

    `configure` has to run in both the client and server builds — the panel calls it too, against a trimmed `SanitizedConfigClient`. `routes`, `actions`, and `handler` only make sense server-side and must stay out of the client bundle. Write a `module.ts` next to `module.server.ts` with the same export name, keeping only `configure`. This is also where a plugin adds panel UI — a header button, say — since that's a Svelte component that has to exist in the browser bundle to render at all:

    ```ts
    // @file:src/lib/plugin/module.ts
    import { definePlugin } from 'rimecms';
    import type { Plugin } from 'rimecms/types';
    import HeaderButton from './HeaderButton.svelte';

    export const myPlugin = definePlugin((): Plugin => ({
      name: 'myPlugin',
      configure: (config) => ({
        ...config,
        panel: {
          ...config.panel,
          components: {
            ...config.panel?.components,
            header: [...(config.panel?.components?.header || []), HeaderButton]
          }
        }
      })
    }));
    ```

    Both files are then reached through one barrel import, which resolves to whichever one matches the current build:

    ```ts
    // @file:src/lib/index.ts
    export { myPlugin } from '$rime/modules';
    ```

    See [Isomorphic modules](/docs/06-guides/02-isomorphic-modules.md).

> [!INFO] Publishing the plugin as an installable package is covered separately in [Authoring a package](/docs/06-guides/04-authoring-a-package.md).

## Adding a collection

`configure` runs before schema generation, so a collection it adds is generated, routed, and shown in the panel nav exactly like one the consumer wrote themselves — `configure` returns a new `Config`, it doesn't mutate the one it receives. Unlike a header component, a collection is plain data: the server builds it, and the app's own bootstrap sends the sanitized result down to the client, so this only needs to happen in `module.server.ts`.

```ts
// @file:src/lib/plugin/module.server.ts
import { definePlugin } from 'rimecms';
import type { Plugin } from 'rimecms/types';
import { Collection } from 'rimecms/config/server';
import { text } from 'rimecms/fields';

const pluginVisits = Collection.create('pluginVisits', {
  fields: [text('path').required()]
});

export const myPlugin = definePlugin((): Plugin => ({
  name: 'myPlugin',
  configure: (config) => ({
    ...config,
    collections: [...(config.collections || []), pluginVisits]
  })
}));
```

## Custom routes

`routes` are matched by exact pathname — no `[param]` segments, no wildcards. Supported methods are `GET`, `POST`, `PATCH`, `DELETE`. Routes aren't auto-protected: `event.locals.user` is only set if the request carries a valid session, so a route that needs auth must check it itself:

```ts
routes: {
  '/api/my-plugin/ping': {
    GET: (event) => {
      if (!event.locals.user) return new Response(null, { status: 401 });
      return json({ message });
    }
  }
}
```

## Actions

`actions` are exposed flat at `event.locals.rime.<name>.<action>` — `{ actions: { ping } }` on a plugin named `myPlugin` becomes `event.locals.rime.myPlugin.ping()`. They aren't bound to the request; a function that needs the current event takes it as an explicit argument:

```ts
actions: {
  ping: (event: RequestEvent) => `${message} to ${event.url.hostname}`;
}
```

## Request handler

`handler` runs on **every** request, not just requests to this plugin's own routes — panel pages and other plugins' routes included. That's what makes it different from `routes`: use it for something that applies across the whole app, like stamping a response header:

```ts
handler: async ({ event, resolve }) => {
  const response = await resolve(event);
  response.headers.set('x-my-plugin', message);
  return response;
};
```

`resolve(event)` runs the rest of the chain — later plugins' handlers, then the built-in collection/area routes and `routes` dispatch. Returning a `Response` without calling it short-circuits all of that, so only do it deliberately (an auth gate, a redirect) rather than as a way to skip requests the handler doesn't care about.
