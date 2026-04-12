A text input field with email validation function.

```ts
import { email } from 'rimecms/fields';

const field = email('email');
```

## Methods

In addition to the [shared field methods](/docs/05-fields/00-overview.md#fields-shared-methods), an email field exposes the following methods:

### defaultValue

Accepts either a raw value or a function. The default value will be populated on your document at creation and before read operations.

```ts
const contact = email('contact').defaultValue('admin@website.com');
```

### isTitle

Can be set once per document, defines the field as the document title.

```ts
const emailField = email('email').isTitle();
```

### placeholder

Sets a custom input placeholder.

```ts
const contact = email('contact').placeholder('custom@placholder.com');
```

### unique

Ensures the field value is unique across all documents in the collection.

```ts
const contact = email('contact').unique();
```

### layout

Sets the email field layout. Currently `compact` and `default` are available. When set to `compact`, the label will be hidden and used as the placeholder instead.

```ts
const contact = email('contact').layout('compact');
```
