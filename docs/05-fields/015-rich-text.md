A rich text editor field powered by [TipTap](https://tiptap.dev). The value is stored as a TipTap/ProseMirror JSON document and automatically serialized to/from the database.

```ts
import { richText } from 'rimecms/fields';
import { bold, heading, link } from 'rimecms/fields/rich-text';

const content = richText('content').features(bold(), heading(2, 3), link());
```

## Methods

In addition to the [shared field methods](/docs/05-fields/00-overview.md#fields-shared-methods), a richText field exposes the following methods.

### features

Configures which editing capabilities are available in the editor. Accepts one or more feature objects — see [Built-in features](#built-in-features) below.

```ts
import { richText } from 'rimecms/fields';
import {
  bold,
  italic,
  heading,
  link,
  hr,
  bulletList,
  orderedList,
  blockquote,
  upload
} from 'rimecms/fields/rich-text';

const body = richText('body').features(
  heading(2, 3, 4),
  bold(),
  italic(),
  link(),
  bulletList(),
  orderedList(),
  blockquote(),
  hr(),
  upload({ source: 'medias?where[mimeType][like]=image' })
);
```

When `.features()` is not called, a default set is used: `heading(2,3,4)`, `bold`, `link`, `hr`, `bulletList`, `orderedList`, `blockquote`.

### defaultValue

Sets the default content populated on creation and before read operations.

```ts
const intro = richText('intro').defaultValue({
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Start writing…' }] }]
});
```

### isTitle

Can be set once per document to define the field as the document title.

```ts
const body = richText('body').isTitle();
```

## Built-in features

All features are imported from `rimecms/fields/rich-text`.

```ts
import {
  bold,
  italic,
  heading,
  link,
  hr,
  bulletList,
  orderedList,
  blockquote,
  upload,
  resource,
  fields
} from 'rimecms/fields/rich-text';
```

| Feature         | Call                              | Description                                                       |
| --------------- | --------------------------------- | ----------------------------------------------------------------- |
| Bold            | `bold()`                          | Bold mark                                                         |
| Italic          | `italic()`                        | Italic mark                                                       |
| Heading         | `heading(...levels)`              | Heading nodes — pass the levels you want, e.g. `heading(2, 3, 4)` |
| Link            | `link(options?)`                  | Inline link mark with a link selector popup                       |
| Horizontal rule | `hr()`                            | Horizontal rule node                                              |
| Bullet list     | `bulletList()`                    | Unordered list                                                    |
| Ordered list    | `orderedList()`                   | Ordered list                                                      |
| Blockquote      | `blockquote()`                    | Blockquote node                                                   |
| Upload          | `upload({ source })`              | Embed documents from an upload collection                         |
| Resource        | `resource({ source })`            | Embed a reference to any document type                            |
| Fields          | `fields({ name, label, fields })` | Embed a structured set of fields                                  |

### upload

Allows editors to insert media from an upload collection directly into the content.

```ts
import { richText } from 'rimecms/fields';
import { upload } from 'rimecms/fields/rich-text';

const body = richText('body').features(upload({ source: 'medias?where[mimeType][like]=image' }));
```

### resource

Allows editors to insert a reference to any document inline (e.g. an internal link resolved at render time).

```ts
import { resource } from 'rimecms/fields/rich-text';

const body = richText('body').features(
  resource({ source: 'pages?where[status][equals]=published' })
);
```

### fields

Embeds a mini-form as an inline node — useful for structured callouts, cards, or any repeatable component with its own fields.

```ts
import { text, toggle } from 'rimecms/fields';
import { fields } from 'rimecms/fields/rich-text';

const body = richText('body').features(
  fields({
    name: 'callout',
    label: 'Callout',
    fields: [text('title'), toggle('warning')]
  })
);
```

With a custom Svelte component for rendering:

```ts
import { text, toggle } from 'rimecms/fields';
import { fields } from 'rimecms/fields/rich-text';
import RenderCallout from './RenderCallout.svelte';

const body = richText('body').features(
  fields({
    name: 'callout',
    label: 'Callout',
    fields: [text('title'), toggle('warning')]
  }).preview(RenderCallout)
);
```

> [!INFO] Blocks and Trees are not currently supported as inline nodes.

## Custom features

You can create custom features by defining a `RichTextFeature` object and passing it to `.features()`.
Bellow a simple example for a lorem ipsum generator.

```ts
import type { RichTextFeatureMark } from 'rimecms/types';
import { SquarePilcrow } from '@lucide/svelte';

const lorems = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor, sapien nec mollis pharetra, ante massa ullamcorper nisl, at blandit magna purus at est.',
  'Nam vel ullamcorper elit, vitae vestibulum leo. Praesent id augue vehicula, placerat risus vitae, sagittis ante. Aenean nulla sapien, aliquet non sodales nec, commodo id tellus.',
  'Cras tincidunt dapibus sem, imperdiet pretium mi faucibus sed. Ut tincidunt nunc ligula, vitae gravida mauris lacinia at.'
];

// Create a custom feature node that inserts a random lorem ipsum paragraph when clicked
const fillWithLorem: RichTextFeatureMark = {
  label: 'Fill with Lorem',
  icon: SquarePilcrow,
  suggestion: {
    command: ({ editor }) => {
      const randomIndex = Math.floor(Math.random() * lorems.length);
      editor.chain().focus().insertContent(lorems[randomIndex]).run();
    }
  }
};

export default {
  name: 'lorem-fill',
  marks: [fillWithLorem]
};
```

Here a code block feature around the tiptap-code-block extension:

```ts
import type { RichTextFeature, RichTextFeatureNode } from 'rimecms/types';
import { Code as CodeIcon } from '@lucide/svelte';
import CodeBlock from '@tiptap/extension-code-block';
import './code-feature.css'; // Custom CSS for code block styling

const codeBlock: RichTextFeatureNode = {
  label: 'Code block',
  icon: CodeIcon,
  suggestion: {
    command: ({ editor }) => editor.chain().focus().toggleCodeBlock().run()
  },
  nodeSelector: {
    command: ({ editor }) => editor.chain().focus().toggleCodeBlock().run()
  },
  isActive: ({ editor }) => editor.isActive('codeBlock')
};

export const codeBlockFeature: RichTextFeature = {
  // For tiptap extensions that don't suppport SSR:
  extension: !import.meta.env.SSR ? CodeBlock : undefined,
  nodes: [codeBlock]
};
```

```ts
import type { RichTextFeature, RichTextFeatureMark } from 'rimecms/types';
import { Code as CodeIcon } from '@lucide/svelte';
import Code from '@tiptap/extension-code';

const codeMark: RichTextFeatureMark = {
  label: 'Code',
  icon: CodeIcon,
  bubbleMenu: {
    command: ({ editor }) => editor.chain().focus().toggleCode().run()
  },
  isActive: ({ editor }) => editor.isActive('code')
};

export const codeFeature: RichTextFeature = {
  extension: !import.meta.env.SSR ? Code : undefined,
  marks: [codeMark]
};
```

## Rendering

Use the `RenderRichText` Svelte component to render a rich text value on the front-end. It accepts a `json` prop (the parsed `JSONContent` object) and an optional `components` map to override the default HTML rendering of any node type.

```svelte
<script lang="ts">
  import { RenderRichText } from 'rimecms/fields/rich-text';
  const { doc } = $props();
</script>

<RenderRichText json={doc.content} />
```

### Custom node renderers

Each node type can be replaced with a custom Svelte component:

```svelte
<script lang="ts">
  import { RenderRichText } from 'rimecms/fields/rich-text';
  import MyHeading from './MyHeading.svelte';
  import MyLink from './MyLink.svelte';
  const { doc } = $props();
</script>

<RenderRichText
  json={doc.content}
  components={{
    heading: MyHeading,
    link: MyLink
  }}
/>
```

Available slots: `heading`, `paragraph`, `blockquote`, `bold`, `italic`, `link`, `ul`, `ol`, `li`, `media`, `resource`.

The component receives `node` (`JSONContent`) and `components` as props, and a `children` snippet for nested content.
Exemple of a custom mark renderer:

```svelte
<script lang="ts">
  import { type RichTextNodeRendererProps } from 'rimecms/fields/rich-text';

  const { node, children }: RichTextNodeRendererProps = $props();
</script>

<span data-type={node.marks?.[0].type || null} {...node.attrs}>
  {@render children?.()}
</span>
```

## Utilities

### richTextJSONToText

Extracts plain text from a rich text JSON value — useful for generating excerpts or search indexes.

```ts
import { richTextJSONToText } from 'rimecms/fields/rich-text';

const plain = richTextJSONToText(doc.content);
```
