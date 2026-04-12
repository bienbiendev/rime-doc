A single-value selection field rendered as a group of radio buttons. Similar to `combobox` but always visible — options are displayed inline rather than behind a popover.

```ts
import { radio } from 'rimecms/fields';

const alignment = radio('alignment').options('left', 'center', 'right');
```

## Methods

In addition to the [shared field methods](/docs/05-fields/00-overview.md#fields-shared-methods), a radio field exposes the following methods.

### options

Defines the available choices. Accepts plain strings or objects with `value` and `label`.

| Parameter    | Type                 | Description                     |
| ------------ | -------------------- | ------------------------------- |
| `...options` | `string \| Option[]` | Option values or option objects |

```ts
// Plain strings — label is auto-capitalized from the value
const size = radio('size').options('small', 'medium', 'large');

// With explicit labels
const layout = radio('layout').options(
  { value: '1col', label: 'Single column' },
  { value: '2col', label: 'Two columns' },
  { value: '3col', label: 'Three columns' }
);
```

### layout

Controls whether options are arranged vertically or horizontally.

| Value       | Description                          |
| ----------- | ------------------------------------ |
| `'default'` | Options stacked vertically (default) |
| `'row'`     | Options arranged in a row            |

```ts
const alignment = radio('alignment').options('left', 'center', 'right').layout('row');
```

### defaultValue

Sets the initially selected value. Accepts a string or a function. If not set, the first option is used.

```ts
const status = radio('status').options('draft', 'published').defaultValue('draft');
```
