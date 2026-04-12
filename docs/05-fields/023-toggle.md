A toggle input field.

```ts
import { toggle } from 'rimecms/fields';

const approved = toggle('approved');
```

## Methods

In addition to the [shared field methods](/docs/05-fields/00-overview.md#fields-shared-methods), a toggle field exposes the following methods:

### defaultValue

Sets the default value that will be populated on your document at creation and before read operations.

```ts
const approved = toggle('approved').defaultValue(false);
```
