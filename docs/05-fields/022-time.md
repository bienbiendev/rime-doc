A time input field.

```ts
import { time } from 'rimecms/fields';

const eventStart = time('eventStart');
```

## Methods

In addition to the [shared field methods](/docs/05-fields/00-overview.md#fields-shared-methods), a time field exposes the following methods:

### defaultValue

Accepts either a raw value or a function. The default value will be populated on your document at creation and before read operations.

```ts
const begin = time('begin').defaultValue('07:00');
```

### unique

Ensures the field value is unique across all documents in the collection.

```ts
const eventStart = time('eventStart').unique();
```
