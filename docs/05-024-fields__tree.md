A hierarchical list field where each row contains custom fields and can have nested children. Used for things like navigation menus, nested categories, or any ordered tree structure.

```ts
import { tree, text } from 'rimecms/fields';

const navigation = tree('navigation').fields(text('label'), text('url'));
```

## Methods

In addition to the [shared field methods](/docs/05-00-fields.md#fields-shared-methods), a tree field exposes the following methods.

### fields

Defines the fields available on each row in the tree.

| Parameter   | Type             | Description                |
| ----------- | ---------------- | -------------------------- |
| `...fields` | `FieldBuilder[]` | One or more field builders |

```ts
const navigation = tree('navigation').fields(
  text('label').label('Link label'),
  link('url').types('url', 'pages')
);
```

### maxDepth

Sets the maximum nesting level. Defaults to `8`.

| Parameter | Type     | Description           |
| --------- | -------- | --------------------- |
| `n`       | `number` | Maximum nesting depth |

```ts
const menu = tree('menu').fields(text('label')).maxDepth(3);
```

### renderTitle

Customizes the display title shown for each row in the panel. Receives the row's field values and its position string.

| Parameter | Type                               | Description                        |
| --------- | ---------------------------------- | ---------------------------------- |
| `fn`      | `({ values, position }) => string` | A function returning the row title |

```ts
const navigation = tree('navigation')
  .fields(text('label'), text('url'))
  .renderTitle(({ values }) => values.label || 'Untitled');
```

### addItemLabel

Customizes the label of the "add item" button in the panel.

```ts
const menu = tree('menu').fields(text('label')).addItemLabel('Add menu item');
```

### localized

Marks the tree and its child fields as localized. Must be called after `.fields()`.

```ts
const navigation = tree('navigation').fields(text('label'), text('url')).localized();
```

## Data shape

Each row includes built-in `path` and `position` fields alongside the custom fields. Nested rows are returned under a `children` array.

```ts
[
  {
    id: 'row-id-1',
    path: '0',
    position: 0,
    label: 'Home',
    url: '/',
    children: []
  },
  {
    id: 'row-id-2',
    path: '1',
    position: 1,
    label: 'About',
    url: '/about',
    children: [
      {
        id: 'row-id-3',
        path: '1.0',
        position: 0,
        label: 'Team',
        url: '/about/team',
        children: []
      }
    ]
  }
];
```
