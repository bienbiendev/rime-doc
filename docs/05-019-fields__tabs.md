A purely presentational field that groups other fields into tabbed panels. Tabs store no data — all fields defined inside tabs are stored at the document root level, just as if they were defined directly on the collection.

```ts
import { tabs, tab, text, richText } from 'rimecms/fields';

const layout = tabs(
  tab('content').fields(text('title'), richText('body')),
  tab('seo').fields(text('metaTitle'), text('metaDescription'))
);
```

## tab

Creates a single tab. The name must be camelCase.

```ts
import { tab } from 'rimecms/fields';

const contentTab = tab('content').label('Content').fields(text('title'));
```

### tab methods

| Method               | Parameter        | Description                                                           |
| -------------------- | ---------------- | --------------------------------------------------------------------- |
| `.label(string)`     | `string`         | Display label shown on the tab. Defaults to the name.                 |
| `.fields(...fields)` | `FieldBuilder[]` | Fields rendered inside this tab.                                      |
| `.live(bool)`        | `boolean`        | Whether the tab participates in the live preview. Defaults to `true`. |

## tabs

Wraps one or more `tab` instances into a tabbed UI container. Takes the tab builders as arguments — no name or additional configuration is needed on the container itself.

```ts
import { tabs, tab } from 'rimecms/fields';

const layout = tabs(
  tab('content').fields(text('title'), richText('body')),
  tab('seo').label('SEO').fields(text('metaTitle'), text('metaDescription')),
  tab('settings').live(false).fields(text('slug'))
);
```

> **Note:** Because tabs are layout-only, they do not appear in the [shared field methods](/docs/05-00-fields.md#fields-shared-methods) (no `.required()`, `.label()`, etc. on the container).
