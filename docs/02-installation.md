1. Create a SvelteKit project if not already done :

```bash
npx sv create svelte my-app && cd my-app
```

2. I**nstall rime** :

```bash
npm install rimecms
```

3. Run the init command :

```bash
npx rime init
```

4. Launch the project :

```bash
npm run dev
```

5. Create the first admin user :

```bash
curl -v POST http://localhost:5173/api/init \
  -H "Content-Type: application/json" \
  -d '{"email": "you@website.com", "password": "super-Secret+2000", "name": "Admin"}'
```

## Next step

You can now visit the `/panel`, in which there will be nothing more than the basic stuffs, so let’s start adding some content types.

[resource:pages:Configuration](/docs/03-00-configuration.md)

## Manual installation

1. After installing Rime and its dependencies, **add the vite plugin** :

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { rime } from 'rimecms/vite';

export default defineConfig({
  plugins: [rime(), sveltekit()]
});
```

2.  Add handlers :

```ts
// src/hooks.server.ts
import { sequence } from '@sveltejs/kit/hooks';
import { handlers } from 'rimecms';
import config from './lib/config.generated/rime.config.server.js';

export const handle = sequence(...(await handlers(config)));
```

3. Add required environment variables :

```bash
# .env
BETTER_AUTH_SECRET=super_secret
PUBLIC_RIME_URL=http://localhost:5173
```

4. Create the drizzle configuration file :

```ts
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/+rime.generated/schema.server.ts',
  out: './db',
  strict: false,
  dialect: 'sqlite',
  dbCredentials: {
    url: './db/my-app.sqlite'
  }
});
```

5. Create the rime configuration file :

```ts
// src/lib/+rime/rime.config.ts
import { rime, Collection } from '$rime/config';
import { text } from 'rimecms/fields';
import { sqliteAdapter } from 'rimecms/sqlite';

const Pages = Collection.create('pages', {
  fields: [text('title').isTitle().required()]
});

export default rime({
  $adapter: sqliteAdapter('my-app.sqlite'),
  collections: [Pages]
});
```

Then run the project and create your first user as described in the 3rd step, section above.

## Troubelshooting

Currently `yarn` and `deno` are not supported. Installation failed as dependencies are not correctly resolved.
