A checkbox input field.

```ts
import { checkbox } from 'rimecms/fields';

const approved = checkbox('approved');
```

## Methods

In addition to the [shared field methods](/docs/04-00-fields.md#fields-shared-methods), a checkbox field exposes the following methods:

### defaultValue

Sets the default value that will be populated on your document at creation and before read operations.

```ts
const approved = checkbox('approved').defaultValue(false);
```
