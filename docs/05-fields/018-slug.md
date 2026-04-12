A slug input field.

```ts
import { slug, text } from 'rimecms/fields';
import { Collection } from '$rime/config';

const Pages = Collection.create('pages', {
  fields: [
    //
    text('title').isTitle(),
    slug('slug').slugify('title').unique()
  ]
});
```

## Methods

In addition to the [shared field methods](/docs/05-fields/00-overview.md#fields-shared-methods), a text field exposes the following methods:

### defaultValue

Accepts either a raw value or a function. The default value will be populated on your document at creation and before read operations.

```ts
const field = slug('slug').defaultValue('some-value');
```

### isTitle

Can be set once per document, defines the field as the document title.

```ts
const field = slug('slug').isTitle();
```

### placeholder

Sets a custom input placeholder.

```ts
const field = slug('slug').placeholder('write-something');
```

### slugify

The from which the value should be generated if unset.

```ts
const field = slug('slug').slugify('name');
```

### unique

Ensures the slug is unique across all documents in the collection.

```ts
const field = slug('slug').unique();
```

### layout

Sets the slug field layout. Currently `compact` and `default` are available. When set to `compact`, the label will be hidden and used as the placeholder instead.

```ts
const field = slug('slug').layout('compact');
```
