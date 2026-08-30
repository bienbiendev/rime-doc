<!-- Summary: Overview of all Rime configuration options: adapters, collections, areas, authentication, custom routes, panel settings, and more. -->

If you’ve followed the [installation](/docs/02-installation.md) steps correctly, you should already have a `pages` collection and the `$adapter` property set up.

The configuration is the core of **Rime**, this is where you configure how your documents will be structured, localization, panel access, custom API routes and [more](#properties)… The configuration entry **must be located at** `src/lib/+rime/rime.config.server.ts`. Here is a basic configuration example :

```ts
// @file:src/lib/+rime/rime.config.server.ts
import { rime, Collection } from '$rime/config';
import { text } from 'rimecms/fields';
import { sqliteAdapter } from 'rimecms/adapter-sqlite'

const Pages = Collection.create('pages', {
  fields: [
    text('title').isTitle().required(),
  ]
});

export default rime({
  $adapter: sqliteAdapter('my-app.sqlite')
  collections: [Pages]
});
```

> [!INFO] Note that **server-only properties** are declared with the `$` prefix. This is because the configuration will be split into a client and server versions, **generated in the **`$lib/+rime.generated`** folder (location may change, but this setup ensures relative imports remain intact).**

## Document prototypes

There are two document prototypes : collections and areas. Collections are repeatable content type e.g. users, pages, products…, and areas are singletons e.g. navigation, footer, information…

```ts
import { Collection, Area } from '$rime/config';
import { text, toggle } from 'rimecms/fields';

const Settings = Area.create('settings', {
  fields: [toggle('maintenance')]
});

const Pages = Collection.create('pages', {
  fields: [text('title').isTitle().required()]
});
```

[resource:pages:collection](/docs/03-configuration/01-collections.md)

[resource:pages:areas](/docs/03-configuration/02-areas.md)

## Properties

### $adapter {!required!}

The database adapter with as param the name of the database located in ./db.

```ts
export default rime({
  $adapter: sqliteAdapter('my-app.sqlite')
});
```

### $smtp

Smtp configuration to enable the rime.mailer core plugin and Better-Auth email features.

```ts
export default rime({
  //...
  $smtp: {
    from: process.env.RIME_SMTP_USER,
    host: process.env.RIME_SMTP_HOST,
    port: parseInt(process.env.RIME_SMTP_PORT || '465'),
    auth: {
      user: process.env.RIME_SMTP_USER,
      password: process.env.RIME_SMTP_PASSWORD
    }
  }
});
```

### $auth

Additional better-auth configuration, currently only adding server plugins is supported.

```ts
import { magicLink } from 'better-auth/plugins';

export default rime({
  //...
  $auth: {
    plugins: [
      magicLink({
        sendMagicLink: async ({ email, token, url }, request) => {
          const event = getRequestEvent();
          // (Require $stmp config to be set)
          event.rime.mailer.sendMail({
            to: email,
            subject: 'Sign-in',
            text: `Your sign-in link ${url}`
          });
        }
      })
    ]
  }
});
```

### $trustedOrigins

Which hosts are allowed to query the API. This property is also forwarded to the Better-Auth config.

```ts
export default rime({
  //...
  $trustedOrigins: [process.env.PUBLIC_RIME_URL] // default
});
```

### $cache

API cache configuration. Only GET requests from non-panel routes are cached. Default to false when user signed-in.

```ts
export default rime({
  //...
  $cache: {
    isEnabled: (event: RequestEvent) => !event.locals.user // default
  }
});
```

> [!INFO] Note that `RIME_CACHE_ENABLED` env variable will enable/disable the functionnality, so `$cache.isEnabled` may be ignored if `RIME_CACHE_ENABLED` is `false`.

### $routes

Custom API routes definition. `GET`, `POST`, `PATCH`, `DELETE` are supported.

```ts
export default rime({
  //...
  $routes: {
    '/api/custom-route': {
      GET: async (event: RequestEvent) => json({ custom: true })
    }
  }
});
```

### $custom

Custom object passed to the server-only config.

```ts
export default rime({
  //...
  $custom: {
    API_KEY: '12345'
  }
});
// Which you can retrieve than with : rime.config.raw.$custom.API_KEY
```

### siteUrl

When defined, a preview button will be added on the panel dashboard header, pointing to this url. Exemple if your front-end is located somewhere else than your backend.

```ts
export default rime({
  //...
  siteUrl: 'https://www.my-front-end.com'
});
```

### collections

List of collection documents configuration. [More](/docs/03-configuration/01-collections.md)

### areas

List of areas documents configuration. [More](/docs/03-configuration/02-areas.md)

### localization

Define available locales for your content. [More](/docs/03-configuration/04-i18n.md).

### staff

Additional config for panel [users collections](/docs/03-configuration/07-auth.md#staff).

```ts
export default rime({
  //...
  staff: {
    roles: ['editor', { label: 'SEO manager', value: 'seo' }],
    fields: [text('website')]
  }
});
```

### panel

Panel access options and specific properties.

```ts
import { SettingsIcon } from '@lucide/svelte';
import CustomDashboard from './CustomDashboard.svelte';
import CustomHeader from './CustomHeader.svelte';
import CustomPage from './CustomPage.svelte';

export default rime({
  //...
  panel: {
    /** Who can access the panel */
    $access: (user) => !!user && user.roles.includes('admin'),
    /** Panel UI language, 'en' or 'fr' */
    language: 'en',
    /** Path to a custom CSS file (relative to the static directory, or external URL) */
    css: '/panel/custom.css',
    /** Sidebar navigation group labels and icons */
    navigation: {
      groups: [{ label: 'Content', icon: SettingsIcon }]
    },
    /** Custom panel pages */
    routes: {
      '/panel/custom-page': {
        label: 'Custom page',
        icon: SettingsIcon,
        group: 'Content',
        component: CustomPage
      }
    },
    /** Slot-in custom Svelte components */
    components: {
      header: [CustomHeader],
      dashboard: CustomDashboard
    }
  }
});
```

### plugins

A plugin runs on both client and server, so if you're writing your own,
keeping server-only code out of the client bundle is up to you — see
[$rime/modules](/docs/06-guides/02-isomorphic-modules.md).

```ts
import { definePlugin } from 'rimecms';

const myPlugin = definePlugin(() => ({
  name: 'my-plugin',
  configure: (config) => config, // mutate collections/panel/etc. before the config is built
  routes: {
    '/api/my-plugin/ping': { GET: async () => json({ ok: true }) }
  }
}));

export default rime({
  //...
  plugins: [myPlugin()]
});
```

[resource:pages:Writing plugins](/docs/06-guides/03-plugin-authoring.md)

### custom

Custom config available server-side and client-side (for example in a custom fields).

```ts
export default rime({
  //...
  custom: {
    colorList: ['orange', 'blue']
  }
});
```

### $custom

Custom config available server-side only with `locals.rime.config.raw.$custom`.

```ts
export default rime({
  //...
  $custom: {
    apiKey: '12345'
  }
});
```
