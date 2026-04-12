A link field that supports multiple link types: URL, email, phone, anchor, or a reference to a collection or area resource. The stored value includes the type, the raw value, the resolved URL, and an optional target.

```ts
import { link } from 'rimecms/fields';

const cta = link('cta').types('url', 'email');
```

## Methods

In addition to the [shared field methods](/docs/05-00-fields.md#fields-shared-methods), a link field exposes the following methods.

### types

Sets the allowed link types that the editor can choose from. Defaults to `['url']`.

| Parameter  | Type         | Description            |
| ---------- | ------------ | ---------------------- |
| `...types` | `LinkType[]` | One or more link types |

Built-in link types:

| Value                | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| `'url'`              | External or internal URL                                   |
| `'email'`            | Email address                                              |
| `'tel'`              | Phone number                                               |
| `'anchor'`           | In-page anchor (`#section`)                                |
| collection/area slug | Reference to a document in a registered collection or area |

```ts
// Allow only URL and email
const contact = link('contact').types('url', 'email');

// Allow a reference to the 'pages' collection
const cta = link('cta').types('url', 'pages');
```

### layout

Controls the visual layout of the link input in the panel.

| Value       | Description                                        |
| ----------- | -------------------------------------------------- |
| `'default'` | Standard layout with all options visible (default) |
| `'compact'` | Condensed layout suitable for small spaces         |

```ts
const cta = link('cta').layout('compact').types('url', 'email');
```

### defaultValue

Sets the initial value. Accepts a `Link` object or a function.

```ts
const cta = link('cta').defaultValue({ type: 'url', value: '', target: '_self' });
```

## Data shape

The link field returns an object with the following properties:

| Property | Type                  | Description                                           |
| -------- | --------------------- | ----------------------------------------------------- |
| `type`   | `string`              | The selected link type                                |
| `value`  | `string \| null`      | The raw entered value (path, email, phone, or anchor) |
| `target` | `'_self' \| '_blank'` | Link target                                           |
| `url`    | `string`              | The resolved absolute URL (populated server-side)     |

```ts
// Resolved link value
{
  type: 'url',
  value: 'https://example.com',
  target: '_blank',
  url: 'https://example.com'
}

// Resource link (e.g. pages collection)
{
  type: 'pages',
  value: 'doc-id-123',
  target: '_self',
  url: '/my-page-slug'
}
```
