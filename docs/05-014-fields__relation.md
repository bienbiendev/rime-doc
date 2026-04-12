A field that creates a reference to one or more documents in another collection or area. At `depth=0` the value contains relation metadata; at `depth>=1` the referenced documents are fully populated.

```ts
import { relation } from 'rimecms/fields';

const author = relation('author').to('users');
```

## Methods

In addition to the [shared field methods](/docs/05-00-fields.md#fields-shared-methods), a relation field exposes the following methods.

### to

Sets the target collection or area slug. This is required.

| Parameter | Type             | Description                               |
| --------- | ---------------- | ----------------------------------------- |
| `slug`    | `CollectionSlug` | The slug of the target collection or area |

```ts
const author = relation('author').to('users');
```

### many

Allows multiple relations to be selected. When set, the value is an array.

```ts
const tags = relation('tags').to('tags').many();
```

### query

Filters the documents available for selection in the panel. Accepts a query string or a function that receives the current document and returns a query string.

| Parameter | Type                        | Description                         |
| --------- | --------------------------- | ----------------------------------- |
| `query`   | `string \| (doc) => string` | A query string or resolver function |

```ts
// Static filter — only show published pages
const page = relation('page').to('pages').query('status=published');

// Dynamic filter — only show items in the same category
const related = relation('related')
  .to('articles')
  .query((doc) => `category=${doc.category}`);
```

### isThumbnail

Marks this relation as the document's thumbnail. Used by the panel to display a preview image in list views.

```ts
const cover = relation('cover').to('media').isThumbnail();
```

### defaultValue

Sets the initial value. Accepts a document ID string, an array of IDs, or a function.

```ts
const category = relation('category').to('categories').defaultValue('cat-id-123');
```

## Data shape

The shape of the returned value depends on the `depth` parameter used when fetching.

```ts
// depth=0 (default) — unresolved reference
{
  author: { relationTo: 'users', documentId: 'user-id-123' }
}

// depth=1 — populated document
{
  author: {
    id: 'user-id-123',
    title: 'Jane Smith',
    _prototype: 'collection',
    _type: 'users',
    // ...all document fields
  }
}

// With .many() at depth=0
{
  tags: [
    { relationTo: 'tags', documentId: 'tag-id-1' },
    { relationTo: 'tags', documentId: 'tag-id-2' }
  ]
}
```

## Utilities

The relation field exports helper functions for working with relation values.

### isRelationResolved

Returns `true` if the value is a fully populated document rather than an unresolved reference.

```ts
import { isRelationResolved } from 'rimecms/fields/relation';

if (isRelationResolved(doc.author)) {
  console.log(doc.author.title);
}
```

### isRelationUnresolved

Returns `true` if the value is an unresolved reference object `{ relationTo, documentId }`.

```ts
import { isRelationUnresolved } from 'rimecms/fields/relation';

if (isRelationUnresolved(doc.author)) {
  console.log(doc.author.documentId);
}
```

### resolveRelation

Fetches and returns the full document for an unresolved relation. If the value is already resolved, returns it as-is. Runs client-side via `fetch`.

```ts
import { resolveRelation } from 'rimecms/fields/relation';

const author = await resolveRelation<UserDoc>(doc.author);
```
