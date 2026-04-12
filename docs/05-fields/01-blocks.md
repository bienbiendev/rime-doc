A blocks field lets editors compose content from a list of typed blocks, each with its own set of fields. This is ideal for building flexible page layouts or complex content structures.

```ts
import { blocks, block, richText, text, relation } from 'rimecms/fields';

const blockParagraph = block('paragraph').fields(richText('text'));
const blockImage = block('image').fields(relation('image').to('medias'));

const layout = blocks('sections', [blockParagraph, blockImage]);
```

## Defining blocks

Each block type is created with the `block(name)` factory and configured with a chain of methods.

### block methods

| Method                | Description                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------ |
| `fields(...fields)`   | The fields that make up this block                                                         |
| `label(string)`       | Display label shown in the panel                                                           |
| `description(string)` | Short description shown when picking a block type                                          |
| `icon(Component)`     | A `@lucide/svelte` icon shown in the block picker                                          |
| `image(url)`          | Preview image URL shown in the block picker                                                |
| `renderTitle(fn)`     | Custom function returning the block's title in the panel — receives `{ values, position }` |

```ts
import { Images, Type } from '@lucide/svelte';

const blockParagraph = block('paragraph')
  .icon(Type)
  .label('Paragraph')
  .description('A simple text block')
  .fields(richText('text'));

const blockImage = block('image')
  .icon(Images)
  .label('Image')
  .fields(relation('image').to('medias').query('where[mimeType][like]=image'), text('legend'));
```

## Runtime data

Each block in the array has a `type` property matching the block's `name`, an `id`, and all of its own field values at the top level:

```json
{
  "sections": [
    {
      "id": "123",
      "type": "paragraph",
      "text": { "type": "doc", "content": [...] }
    },
    {
      "id": "456",
      "type": "image",
      "image": { "relationTo": "medias", "documentId": "xyz" },
      "legend": "A sunset over the mountains"
    }
  ]
}
```

## Nested blocks

Blocks can contain other `blocks` fields, enabling multi-level layouts.

```ts
const blockSubContent = block('content').fields(text('title'), richText('text'));

const blockSection = block('section').fields(
  text('title'),
  blocks('items', [blockParagraph, blockImage, blockSubContent])
);

const layout = blocks('sections', [blockSection]);
```
