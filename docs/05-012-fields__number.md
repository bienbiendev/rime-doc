A numeric input field. The stored value is always a JavaScript `number`. A default value of `0` is used if not specified and no `min` is set; otherwise the `min` value becomes the default.

```ts
import { number } from 'rimecms/fields';

const price = number('price').min(0);
```

## Methods

In addition to the [shared field methods](/docs/05-00-fields.md#fields-shared-methods), a number field exposes the following methods.

### min

Sets the minimum allowed value. Also used as the default value if no `defaultValue` is set.

| Parameter | Type     | Description   |
| --------- | -------- | ------------- |
| `value`   | `number` | Minimum value |

```ts
const quantity = number('quantity').min(1);
```

### max

Sets the maximum allowed value.

| Parameter | Type     | Description   |
| --------- | -------- | ------------- |
| `value`   | `number` | Maximum value |

```ts
const rating = number('rating').min(1).max(5);
```

### defaultValue

Sets the initial value. Accepts a number or a function.

| Parameter | Type                        | Description                                                |
| --------- | --------------------------- | ---------------------------------------------------------- |
| `value`   | `number \| (doc) => number` | Static number or a function receiving the current document |

```ts
const order = number('order').defaultValue(0);

// Dynamic default
const score = number('score').defaultValue(() => Math.round(Math.random() * 100));
```
