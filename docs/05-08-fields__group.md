A structural field that groups related fields under a single named key in the document. The group itself stores no value — its child fields are stored flat under the group's name.

```ts
import { group, text, number } from 'rimecms/fields';

const seo = group('seo').fields(text('title'), text('description'));
```

## Methods

In addition to the [shared field methods](/docs/05-00-fields.md#fields-shared-methods), a group field exposes the following methods.

### fields

Defines the child fields nested inside the group.

| Parameter   | Type             | Description                |
| ----------- | ---------------- | -------------------------- |
| `...fields` | `FieldBuilder[]` | One or more field builders |

```ts
const seo = group('seo').fields(
  text('title').label('SEO Title'),
  text('description').label('Meta Description')
);
```

### label

Sets a display label for the group panel heading.

```ts
const seo = group('seo').label('SEO').fields(text('title'));
```

### localized

Marks the group and all its child fields as localized. Must be called after `.fields()`.

```ts
const seo = group('seo').fields(text('title'), text('description')).localized();
```

## Data shape

The group's fields are stored and returned nested under the group name.

```ts
// Document data
{
  seo: {
    title: 'My page title',
    description: 'My page description'
  }
}
```
