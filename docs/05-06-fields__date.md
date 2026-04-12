A date input field.

```ts
import { date } from 'rimecms/fields';

const eventStart = date('eventStart');
```

## Methods

In addition to the [shared field methods](/docs/04-00-fields.md#fields-shared-methods), a date field exposes the following methods:

### defaultValue

Accepts either a raw value or a function. The default value will be populated on your document at creation and before read operations.

```ts
const published = date('published').defaultValue(() => new Date());
```

### isTitle

Can be set once per document, defines the field as the document title.

```ts
const birthday = date('birthday').isTitle();
```

### unique

Ensures the field value is unique across all documents in the collection.

```ts
const birthday = date('birthday').unique();
```
