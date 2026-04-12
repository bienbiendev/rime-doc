A simple textarea field.

```ts
import { textarea } from 'rimecms/fields';

const intro = textarea('intro');
```

## Methods

In addition to the [shared field methods](/docs/05-fields/00-overview.md#fields-shared-methods), a textarea field exposes the following methods:

### defaultValue

Accepts either a raw value or a function. The default value will be populated on your document at creation and before read operations.

```ts
const intro = textarea('author').defaultValue('Lorem ipsum dolor sit amet');
```

### isTitle

Can be set once per document, defines the field as the document title.

```ts
const longTitle = textarea('longTitle').isTitle();
```

### placeholder

Sets a custom placeholder.

```ts
const intro = textarea('intro').placeholder('Write something...');
```
