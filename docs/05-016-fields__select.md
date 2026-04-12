A selection field that supports both single and multiple values, rendered as an inline tag list. Use `.many()` to allow multiple selections.

```ts
import { select } from 'rimecms/fields';

const tags = select('tags').options('news', 'events', 'blog').many();
```

## Methods

In addition to the [shared field methods](/docs/05-00-fields.md#fields-shared-methods), a select field exposes the following methods.

### options

Defines the available choices. Accepts plain strings or objects with `value` and `label`.

| Parameter    | Type                 | Description                     |
| ------------ | -------------------- | ------------------------------- |
| `...options` | `string \| Option[]` | Option values or option objects |

```ts
// Plain strings
const status = select('status').options('draft', 'review', 'published');

// With explicit labels
const category = select('category').options(
  { value: 'news', label: 'News' },
  { value: 'events', label: 'Events & Updates' }
);
```

### many

Allows multiple values to be selected. The stored value becomes `string[]` instead of `string`.

```ts
const tags = select('tags').options('news', 'events', 'blog').many();
```

### defaultValue

Sets the initial selection. Accepts a string array or a function when used with `.many()`.

```ts
// Single value (without .many())
const status = select('status').options('draft', 'published').defaultValue(['draft']);

// Multiple values
const tags = select('tags').options('news', 'events', 'blog').many().defaultValue(['news']);
```

## combobox vs select

|                 | `combobox`         | `select`            |
| --------------- | ------------------ | ------------------- |
| Multiple values | No                 | Yes, with `.many()` |
| Icon per option | Yes                | No                  |
| UI              | Searchable popover | Inline tag list     |
