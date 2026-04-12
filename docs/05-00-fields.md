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

[resource:pages:blocks](/docs/04-01-fields__blocks.md)
[resource:pages:checkbox](/docs/04-02-fields__checkbox.md)
[resource:pages:combobox](/docs/04-03-fields__combobox.md)
[resource:pages:component](/docs/04-04-fields__component.md)
[resource:pages:date](/docs/04-05-fields__date.md)
[resource:pages:email](/docs/04-06-fields__email.md)
[resource:pages:group](/docs/04-07-fields__group.md)
[resource:pages:link](/docs/04-08-fields__link.md)
[resource:pages:number](/docs/04-09-fields__number.md)
[resource:pages:radio](/docs/04-10-fields__radio.md)
[resource:pages:relation](/docs/04-11-fields__relation.md)
[resource:pages:rich-text](/docs/04-12-fields__rich-text.md)
[resource:pages:select](/docs/04-13-fields__select.md)
[resource:pages:separator](/docs/04-14-fields__separator.md)
[resource:pages:slug](/docs/04-15-fields__slug.md)
[resource:pages:tabs](/docs/04-16-fields__tabs.md)
[resource:pages:text](/docs/04-17-fields__text.md)
[resource:pages:textarea](/docs/04-18-fields__textarea.md)
[resource:pages:time](/docs/04-19-fields__time.md)
[resource:pages:toggle](/docs/04-20-fields__toggle.md)
[resource:pages:tree](/docs/04-21-fields__tree.md)

## Fields shared methods

All non-presentational fields (all except `separator`, `component` and `tabs` fields) share the following methods:

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

Set a field as localized. More on [i18n](/docs/03-04-configuration__i18n.md).

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

Documentation in progress
