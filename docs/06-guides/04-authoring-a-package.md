<!-- Summary: Ship a field or plugin as an installable npm package — scaffold, package.json, build, publish. -->

A field or plugin you build for one app is just local code. Publishing it as a package is what lets any other app install and use it — this walks through scaffolding, configuring, and shipping one. Applies the same way to a [field](/docs/06-guides/01-custom-field-definition.md) or a [plugin](/docs/06-guides/03-plugin-authoring.md).

1. Scaffold a svelteKit library

    ```bash
    npx sv create --template library my-package
    cd my-package
    npm install rimecms --save-peer
    ```

2. Write your package

    ```ts
    // @file:src/lib/my-thing/module.server.ts
    import { definePlugin } from 'rimecms';

    export const myThing = definePlugin(() => ({
      name: 'myThing'
      // ...
    }));
    ```
    
    ```ts
    // @file:src/lib/index.ts — the only file a consumer imports
    export { myThing } from '$rime/modules';
    ```

3. Edit your `package.json`

    ```json
    {
      "exports": {
        ".": { "types": "./dist/index.d.ts", "svelte": "./dist/index.js" },
        "./*": "./dist/*.js"
      },
      "scripts": { "prepack": "rime package" }
    }
    ```

    If you'd rather not expose your whole `dist/` via the `"./*"` wildcard, list each isomorphic module file explicitly instead:

    ```json
    "exports": {
      ".": { "types": "./dist/index.d.ts", "svelte": "./dist/index.js" },
      "./dist/plugin/module.js": "./dist/plugin/module.js",
      "./dist/plugin/module.server.js": "./dist/plugin/module.server.js"
    }
    ```

4. Build and publish

    ```bash
    npm publish
    ```

    `npm publish` runs `prepack` first, which is `rime package` equivalent to `svelte-kit sync && svelte-package && rime generate-manifest`.