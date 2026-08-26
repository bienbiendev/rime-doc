<!-- Summary: Overview of all available Rime field types and their shared configuration methods for defining document structure. -->

Fields are the way you define the structure of your documents. From simple text to nested arrays, blocks, rich-text, relations, and more, Rime provides a wide variety of fields to customize your content. If you need more functionality, creating custom fields is also possible.

Example field definition for a `posts` collection:

```ts
const posts = Collection.create('posts', {
  fields: [
    tabs(
      tab('attributes').fields(
        text('title').required().isTitle(),
        slug('slug').required().slugify('attributes.title'),
        relation('thumbnail').to('medias')
      ),
      tab('content').fields(
        //
        richText('text').features(heading(2, 3, 4), bold(), link(), medias())
      ),
      tab('seo').fields(
        text('title').hint('The title present in the browser tab'),
        text('description').hint('Text displayed in search results, about 120 characters max.')
      )
    )
  ]
});
```

## Built-in fields

[resource:pages:blocks](/docs/05-fields/01-blocks.md)
[resource:pages:checkbox](/docs/05-fields/02-checkbox.md)
[resource:pages:combobox](/docs/05-fields/03-combobox.md)
[resource:pages:component](/docs/05-fields/04-component.md)
[resource:pages:date](/docs/05-fields/06-date.md)
[resource:pages:email](/docs/05-fields/07-email.md)
[resource:pages:group](/docs/05-fields/08-group.md)
[resource:pages:link](/docs/05-fields/011-link.md)
[resource:pages:number](/docs/05-fields/012-number.md)
[resource:pages:radio](/docs/05-fields/013-radio.md)
[resource:pages:relation](/docs/05-fields/014-relation.md)
[resource:pages:rich-text](/docs/05-fields/015-rich-text.md)
[resource:pages:select](/docs/05-fields/016-select.md)
[resource:pages:separator](/docs/05-fields/017-separator.md)
[resource:pages:slug](/docs/05-fields/018-slug.md)
[resource:pages:tabs](/docs/05-fields/019-tabs.md)
[resource:pages:text](/docs/05-fields/020-text.md)
[resource:pages:textarea](/docs/05-fields/020-text.md)
[resource:pages:time](/docs/05-fields/022-time.md)
[resource:pages:toggle](/docs/05-fields/023-toggle.md)
[resource:pages:tree](/docs/05-fields/024-tree.md)

## Fields shared methods

All non-presentational fields (all except `separator`, `component` and `tabs` fields) share the following methods:

| Hook | Runs |
| --- | --- |
| `$beforeRead` | server |
| `$beforeSave` | server |
| `beforeValidate` | client + server |
| `validate` | client + server |
| `onChange` | client |

### $beforeRead {{server only}}

Field hook triggered before a read operation.

```ts
import { textarea } from 'rimecms';

const intro = textarea('intro').$beforeRead((value, context) => {
  return value.replace('\n', '<br/>');
});
```

### $beforeSave {{server only}}

Field hook triggered before a create/update operation.

```ts
import { number } from 'rimecms';

const stock = number('stock').$beforeSave((value, context) => {
  const { event, documentId } = context;
  event.locals.rime.mailer.sendMail({
    to: 'admin@website.com',
    subject: 'Out of stock',
    text: `The product ${documentId} is out of stock`
  });
});
```

### beforeValidate

Field hook triggered before the validate function runs.

```ts
import { time } from 'rimecms';

const start = text('start')
  .beforeValidate((value => {
    const segments = value.split(':')
    return Number(segments[0]) + Number(segments[1]) / 60
  })
  .validate((value) => {
    typeof value === 'number' && value > 12.5 || "Can't start before 12h30"
  })
```

### condition

Whether to display the field in the admin panel.

```ts
import { toggle, text } from 'rimecms';

const fields = [toggle('isHome'), text('url').condition((doc, siblings) => !siblings.isHome)];
```

### clone

Deep clone a field.

```ts
import { text } from 'rimecms';

const sharedTitle = text('title').label('Title').placeholder('Post title').required();
const optionalTitle = sharedTitle.clone().required(false);
```

### hidden

Whether the field should be displayed in the panel.

```ts
import { text } from 'rimecms';

const metas = text('metas').hidden();
```

### hint

Additional information to display with the field.

```ts
import { text } from 'rimecms';

const description = text('description').hint('Around 110/130 characters in length');
```

### label

A custom field label.

```ts
import { text } from 'rimecms';

const intro = text('intro').label('Introduction');
```

### localized

Set a field as localized. More on [i18n](/docs/03-configuration/04-i18n.md).

```ts
import { text } from 'rimecms';

const title = text('title').localized();
```

### onChange

Client-side field hook triggered whenever the field value changes.

```ts
import { text, time } from 'rimecms';

const fields = [
  time('start').onChange((value, context) => {
    const fieldEnd = context.useField('end');
    const toFloat = (str: string) => parseFloat(str.replace(':', '.'));
    if (toFloat(value) > toFloat(fieldEnd.value)) {
      fieldEnd.value = value;
    }
  }),
  time('end')
];
```

### required

Sets the field as required. An empty field without a default value will return an error on update/create operations.

```ts
import { text } from 'rimecms';

const title = text('title').required();
```

### table

Table configuration for the collection table. Has no effect on areas fields.

```ts
import { date } from 'rimecms';
import RenderDateEnd from 'RenderDateEnd.svelte';

const dateStart = date('start').table(2); // Set the column position only
const dateEnd = date('end').table({
  // Optional cell component
  component: RenderDateEnd,
  // Column position
  position: 3
});
```

### validate

A custom validation function that **replaces** the default one. Returns either `true` for a valid value or a string representing the error. Called on both server and client.

```ts
import { text } from 'rimecms';

const title = text('title').validate((value, metas) => {
  return (
    (value && typeof value === 'string' && value.length > 12) ||
    'Title should be at least 12 characters in length'
  );
});
```

The `metas` argument passed to the validation method:

```ts
{
    /** The processed document data */
    data: Partial<TData>;
    /** For which operation the validation runs */
    operation: "create" | "update";
    /** The document id, undefined on create operation */
    id: string | undefined;
    /** The current signed-in user */
    user: User | undefined;
    /** Current locale, default to locale fallback */
    locale: string | undefined;
    /** The current field configuration */
    config: TConfig extends FormField ? TConfig : FormField;
}
```

## Define your own field

For a quick one-off input with no data binding, use the [component field](/docs/05-fields/04-component.md). For a real, reusable field type — its own stored value, validation, default value, usable anywhere in a `fields: [...]` array just like `text` or `select` — extend `FieldBuilder` (presentational, like `separator`/`tabs`) or `FormFieldBuilder` (data-bearing, like every other field), both exported from `rimecms/fields`. The panel chrome (`Field.fieldset`, `Field.Label`, `Field.Hint`, `Field.Error`) is exported from `rimecms/panel`; bind the field's value in your component with `form.useField(path, config)`, same as every built-in field.

A `FormFieldBuilder` subclass overrides:

### dataType

The storage primitive used to generate the database column: `text`, `boolean`, `number`, `timestamp` or `json`. No adapter-specific code is needed.

### component

The Svelte component rendered in the panel. Receives `{ path, config, form }`.

### cell

Optional. The component rendered inside a collection list row when the field is added as a column via [`.table()`](#table). Receives just `{ value }`; without it the column falls back to rendering the raw value.

### generateType

Feeds the field's contribution to the generated document type (`$lib/app.generated.d.ts`) — a `name: TsType` (or `name?: TsType` when not required) fragment. `FormFieldBuilder`'s own default already returns `` `${name}${required ? '' : '?'}: any` `` if left unoverridden, so a field is never silently missing from the generated type. It's `protected` — only reachable via `.use.generateType()`, so calling it directly from a `fields: [...]` array is a compile error, not an accident waiting to happen.

Container fields recurse into their children with `child.use.generateType()`: `group`/`tabs` nest the result under their own name, `blocks`/`tree` instead reference a separately generated `Block<Name>`/`Tree<Name>` type.

### compile()

Rarely needs overriding — the base `FieldBuilder.compile()` already turns `this.field` into plain data plus `component`/`cell`. Only override it if your field holds nested field builders that must themselves be compiled, the way `group`, `tabs`, `blocks` and `tree` do for their child fields.

### A hook needing server-only code

`$beforeRead`/`$beforeSave` need real server access (`event.locals.rime`) — keep that code out of the client bundle with a `module.server.ts`:

```ts
// @file:src/lib/fields/color/module.server.ts
export const logSave: FieldHook = async (value, ctx) => {
  await ctx.event.locals.rime.collection('auditLog').create({ data: { field: 'color', value } });
  return value;
};
```

```ts
// @file:src/lib/fields/color/index.ts
import { logSave } from '$rime/modules';
// this.field.hooks = { beforeSave: [logSave] };
```

See [Isomorphic modules](/docs/06-guide/02-isomorphic-modules.md).

### A hook needing different client/server behavior

`beforeValidate` runs on both sides — split it when the real check only makes sense server-side (e.g. a uniqueness check against the database), with a lighter client-side stand-in:

```ts
// @file:src/lib/fields/color/module.ts
export const checkUnique: FieldHookShared = async (value) => value;
```

```ts
// @file:src/lib/fields/color/module.server.ts
export const checkUnique: FieldHookShared = async (value, ctx) => {
  const existing = await ctx.event.locals.rime.collection('pages').find({ where: { color: value } });
  if (existing.length) throw new Error('Color already used');
  return value;
};
```

```ts
// @file:src/lib/fields/color/index.ts
import { checkUnique } from '$rime/modules';
// this.field.hooks = { beforeValidate: [checkUnique] };
```

See [Isomorphic modules](/docs/06-guide/02-isomorphic-modules.md).

See the [custom field definition guide](/docs/06-guide/01-custom-field-definition.md) for a full walkthrough building one.
