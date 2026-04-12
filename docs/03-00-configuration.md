If you’ve followed the [installation](/docs/02-installation.md) steps correctly, you should already have a `pages` collection and the `$adapter` property set up.

The configuration is the core of **Rime**, this is where you configure how your documents will be structured, localization, panel access, custom API routes and [more](#properties)… The configuration entry **must be located at **`src/lib/+rime/rime.config.ts`. Here is a basic configuration example :

```ts
// src/lib/+rime/rime.config.ts
import { rime, Collection } from '$rime/config';
import { text } from 'rimecms/fields';
import { sqliteAdapter } from 'rimecms/sqlite'

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

[resource:pages:collection](/docs/03-01-configuration__collections.md)

[resource:pages:areas](/docs/03-02-configuration__areas.md)

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
          event.rime.mailer.sendMail({
            // (Require $stmp config to be set)
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
  $trustedOrigins: [process.env.PUBLIC_RIME_URL] // Default
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

List of collection documents configuration. [More](/docs/03-01-configuration__collections.md)

### areas

List of areas documents configuration. [More](/docs/03-02-configuration__areas.md)

### localization

Define available locales for your content. [More](/docs/03-04-configuration__areas.md)

### staff

Additional config for panel users collections. // @TODO add full configuration page

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

Panel access options and specific properties. // @TODO add full configuration page

```ts
export default rime({
  //...
  panel: {
    $access: (user) => !!user && user.roles.includes('admin'),
    fields: [text('website')],
    css: '/panel/custom.css'
  }
});
```

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
