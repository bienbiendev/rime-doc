<!-- Summary: How to build a plugin — collections, routes, hooks, and panel UI a consumer app installs like any dependency. -->

A plugin is a `definePlugin()` factory a consumer passes into their config's `plugins: []`.

1. Define it

```ts
// @file:src/lib/plugin/module.server.ts
import { definePlugin } from 'rimecms';
import type { Plugin } from 'rimecms/types';
import { json } from '@sveltejs/kit';

export const myPlugin = definePlugin((options?: { greeting?: string }): Plugin => {
  const message = options?.greeting ?? 'pong';

  return {
    name: 'myPlugin',
    // Add collections, panel components, ...
    configure: (config) => ({ ...config }),
    // Custom routes
    routes: { '/api/my-plugin/ping': { GET: () => json({ message }) } },
    // event.locals.rime.myPlugin.ping()
    actions: { ping: () => message },
    // Runs on every request
    handler: async ({ event, resolve }) => resolve(event)
  };
});
```

2. Export it as an isomorphic module

rimecms plugins are consumed both client and server side. Therefore you must export it as an isomorphic module. See [Isomorphic modules](/docs/06-guides/02-isomorphic-modules.md).

```ts
// @file:src/lib/index.ts
export { myPlugin } from '$rime/modules';
```

If you need a client-side version of the plugin, add a `module.ts` with the same export name along your `module.server.ts` :

```ts
// @file:src/lib/plugin/module.ts
import { definePlugin } from 'rimecms';
import type { Plugin } from 'rimecms/types';

export const myPlugin = definePlugin((): Plugin => ({
  name: 'myPlugin',
  configure: (config) => ({ ...config /* panel-only additions */ })
}));
```

3. Ship it

See [Authoring a package](/docs/06-guides/04-authoring-a-package.md).

4. Use it

```ts
// @file:src/lib/+rime/rime.config.server.ts
import { myPlugin } from 'my-plugin';

export default rime({
  //...
  plugins: [myPlugin({ greeting: 'hi' })]
});
```
