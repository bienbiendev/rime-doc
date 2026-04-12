A simple text input field.

```ts
import { text } from 'rimecms/fields';

const title = text('title');
```

## Methods

In addition to the [shared field methods](/docs/05-fields/00-overview.md#fields-shared-methods), a text field exposes the following methods:

### defaultValue

Accepts either a raw value or a function. The default value will be populated on your document at creation and before read operations.

```ts
const author = text('author').defaultValue((event) => event.locals.user?.name || 'anonymous');
```

### isTitle

Can be set once per document, defines the field as the document title.

```ts
const title = text('title').isTitle();
```

### placeholder

Sets a custom input placeholder.

```ts
const intro = text('intro').placeholder('Write something...');
```

### unique

Ensures the field value is unique across all documents in the collection.

```ts
const email = text('email').unique();
```

### layout

Sets the text field layout. Currently `compact` and `default` are available. When set to `compact`, the label will be hidden and used as the placeholder instead.

```ts
const title = text('title').layout('compact');
```
