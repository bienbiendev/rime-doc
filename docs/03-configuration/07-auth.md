Rime's authentication is built on [Better Auth](https://better-auth.com). It covers two distinct concerns: **staff** (panel users) and **collection auth** (user-facing accounts).

## Staff

The built-in `staff` collection powers panel access. It always uses password authentication and always includes `admin` and `staff` roles. You can extend it through the top-level `staff` key in your Rime config.

```ts
export default rime({
  $adapter: adapterSqlite('app.sqlite'),
  staff: {
    roles: [{ value: 'editor' }],
    fields: [text('department')]
  }
  // ...
});
```

### Options

| Option        | Type                                              | Description                                                                                                                                                        |
| ------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `roles`       | `(string \| { value: string, label?: string })[]` | Additional roles beyond the default `admin` and `staff`. An `admin` role is always present; if no other roles are provided, a `staff` role is added automatically. |
| `fields`      | `FieldBuilder[]`                                  | Extra fields added to staff member profiles.                                                                                                                       |
| `access`      | `Access`                                          | Override the default access rules for the staff collection.                                                                                                        |
| `label`       | `CollectionLabel`                                 | Override the staff collection label shown in the panel.                                                                                                            |
| `panel.group` | `string`                                          | Navigation group for the staff collection in the panel sidebar.                                                                                                    |

## Collection auth

Any collection can become an auth collection by adding an `auth` property.

### Email / Password

This automatically adds `name`, `email` (password type only), and `roles` fields to the collection, and wires it into Better Auth.

```ts
const Users = Collection.create('users', {
  auth: { type: 'password' }, // or auth: true,
  fields: [text('website')],
  access: {
    create: () => true,
    read: () => true,
    update: (user, { id }) => access.isAdminOrMe(user, id),
    delete: (user, { id }) => access.isAdminOrMe(user, id)
  }
});
```

### API Key

Members authenticate via an API key sent in the `x-api-key` header. No email field is added. An `apiKeyId` and an `ownerId` field are automatically included instead.
The API key is linked to user that created it, and inherits that user's roles. This allows you to create limited-access keys for third-party integrations.

```ts
const Apps = Collection.create('apps', {
  auth: {
    type: 'apiKey',
    roles: ['apps']
  },
  fields: [select('supports').options('pages', 'posts').many()],
  access: {
    create: (user) => access.isAdmin(user),
    read: (user) => access.isAdmin(user),
    update: (user) => access.isAdmin(user),
    delete: (user) => access.isAdmin(user)
  }
});
```

Keys are generated and managed through the panel. On each API request the key is verified and its embedded `roles` are forwarded onto `event.locals.user`.

### roles

The `roles` option defines the choices available in the panel when assigning a role to a member. The first non-admin role becomes the default assigned on sign-up. The `admin` role is reserved for the staff collection and is silently filtered out on generic collections.

```ts
auth: {
  type: 'password',
  roles: ['user', 'premium'],
}
```

## Custom Better Auth plugins

You can extend the underlying Better Auth instance with additional plugins using the `$auth` key. This is useful for adding OAuth providers, magic links, passkeys, or any other Better Auth plugin.

> [!INFO] The feature is experimental and has not been extensively tested with different plugin types.

```ts
import { github } from 'better-auth/social-providers';
import { magicLink } from 'better-auth/plugins';

export default rime({
  $adapter: adapterSqlite('app.sqlite'),
  $auth: {
    plugins: [
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          await mailer.send({ to: email, subject: 'Sign in', text: url });
        }
      })
    ]
  }
  // ...
});
```

Plugins added here are merged with Rime's built-in Better Auth configuration (which already includes the `admin` and `apiKey` plugins).
