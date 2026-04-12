A single-value selection field rendered as a searchable popover. Unlike `select`, it only allows picking one value and supports optional icons per option.

```ts
import { combobox } from 'rimecms/fields';

const template = combobox('template').options('basic', 'large', 'full-width');
```

## Methods

In addition to the [shared field methods](/docs/05-00-fields.md#fields-shared-methods), a combobox field exposes the following methods.

### options

Defines the available choices. Accepts plain strings or objects with `value`, `label`, and an optional `icon`.

```ts
// Plain strings — label is auto-capitalized from the value
const status = combobox('status').options('draft', 'published', 'archived');

// With labels and icons
import { Home, LayoutTemplate, Users } from '@lucide/svelte';

const template = combobox('template').options(
  { value: 'home', label: 'Homepage', icon: Home },
  { value: 'landing', label: 'Landing page', icon: LayoutTemplate },
  { value: 'team', label: 'Team', icon: Users }
);
```

### defaultValue

Accepts either a raw string value or a function.

```ts
const status = combobox('status').options('draft', 'published').defaultValue('draft');
```

## combobox vs select

|                 | `combobox`         | `select`            |
| --------------- | ------------------ | ------------------- |
| Multiple values | No                 | Yes, with `.many()` |
| Icon per option | Yes                | No                  |
| UI              | Searchable popover | Inline tags         |
