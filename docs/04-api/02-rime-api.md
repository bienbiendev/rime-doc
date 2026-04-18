The Rime API is the server-side interface for interacting with your data. It is available on `event.locals.rime` in any SvelteKit server context — load functions, form actions, hooks, and API routes.

```ts
export const load = async ({ locals }) => {
  const { rime } = locals;
  const settings = await rime.area('settings').find();
  const posts = await rime.collection('posts').find({ sort: '-createdAt', limit: 10 });
  return { settings, posts };
};
```

## Collections

Access a collection with `rime.collection('slug')`. All methods are fully typed based on your configuration.

### find

Returns `Promise<Doc[]>`.

| Parameter | Type       | Description                                        |
| --------- | ---------- | -------------------------------------------------- |
| `query`   | `string`   | `where` filter — see [query syntax](#query-syntax) |
| `sort`    | `string`   | Field to sort by, prefix with `-` for descending   |
| `limit`   | `number`   | Maximum number of results                          |
| `offset`  | `number`   | Number of results to skip                          |
| `depth`   | `number`   | Relation population depth, 0–6 (default: `0`)      |
| `select`  | `string[]` | Return only the specified fields                   |
| `locale`  | `string`   | Override the current locale                        |
| `draft`   | `boolean`  | Include draft versions (versioned only)            |

```ts
const posts = await rime.collection('posts').find({
  query: 'where[status][equals]=published',
  sort: '-createdAt',
  limit: 10
});
```

### findById

Returns `Promise<Doc>`.

| Parameter   | Type       | Description                                      |
| ----------- | ---------- | ------------------------------------------------ |
| `id`        | `string`   | Document ID                                      |
| `depth`     | `number`   | Relation population depth, 0–6 (default: `0`)    |
| `select`    | `string[]` | Return only the specified fields                 |
| `locale`    | `string`   | Override the current locale                      |
| `versionId` | `string`   | Get a specific version snapshot (versioned only) |
| `draft`     | `boolean`  | Get the draft version (versioned only)           |

```ts
const post = await rime.collection('posts').findById({ id: '123', depth: 1 });
```

### create

Returns `Promise<Doc>`.

| Parameter | Type               | Description                 |
| --------- | ------------------ | --------------------------- |
| `data`    | `DeepPartial<Doc>` | Document data               |
| `locale`  | `string`           | Locale for localized fields |

```ts
const post = await rime.collection('posts').create({
  data: { attributes: { title: 'Hello', slug: 'hello' } }
});
```

### updateById

Returns `Promise<Doc>`.

| Parameter   | Type               | Description                                 |
| ----------- | ------------------ | ------------------------------------------- |
| `id`        | `string`           | Document ID                                 |
| `data`      | `DeepPartial<Doc>` | Fields to update                            |
| `locale`    | `string`           | Locale to update                            |
| `versionId` | `string`           | Update a specific version (versioned only)  |
| `draft`     | `boolean`          | Create a new draft version (versioned only) |

```ts
const post = await rime.collection('posts').updateById({
  id: '123',
  data: { attributes: { title: 'Updated' } }
});
```

### deleteById

Returns `Promise<string>` (the deleted document id).

| Parameter | Type     | Description |
| --------- | -------- | ----------- |
| `id`      | `string` | Document ID |

```ts
await rime.collection('posts').deleteById({ id: '123' });
```

### delete

Deletes all documents matching a query. Returns `Promise<string[]>` (deleted ids).

| Parameter | Type     | Description              |
| --------- | -------- | ------------------------ |
| `query`   | `string` | `where` filter           |
| `sort`    | `string` | Sort order               |
| `limit`   | `number` | Maximum number to delete |
| `offset`  | `number` | Number to skip           |

```ts
await rime.collection('posts').delete({ query: 'where[status][equals]=draft' });
```

### duplicate

Returns `Promise<string>` (the new document id).

| Parameter | Type     | Description                     |
| --------- | -------- | ------------------------------- |
| `id`      | `string` | ID of the document to duplicate |

```ts
const newId = await rime.collection('posts').duplicate({ id: '123' });
```

### blank

Returns a `Doc` populated with default field values.

```ts
const empty = rime.collection('posts').blank();
```

## Areas

Access an area with `rime.area('slug')`.

### find

Returns `Promise<Doc>`.

| Parameter   | Type       | Description                                      |
| ----------- | ---------- | ------------------------------------------------ |
| `depth`     | `number`   | Relation population depth, 0–6 (default: `0`)    |
| `select`    | `string[]` | Return only the specified fields                 |
| `locale`    | `string`   | Override the current locale                      |
| `versionId` | `string`   | Get a specific version snapshot (versioned only) |
| `draft`     | `boolean`  | Get the draft version (versioned only)           |

```ts
const settings = await rime.area('settings').find({ depth: 1 });
```

### update

Returns `Promise<Doc>`.

| Parameter   | Type               | Description                                 |
| ----------- | ------------------ | ------------------------------------------- |
| `data`      | `DeepPartial<Doc>` | Fields to update                            |
| `locale`    | `string`           | Locale to update                            |
| `versionId` | `string`           | Update a specific version (versioned only)  |
| `draft`     | `boolean`          | Create a new draft version (versioned only) |

```ts
await rime.area('settings').update({ data: { maintenance: true } });
```

### blank

Returns a `Doc` populated with default field values.

```ts
const empty = rime.area('settings').blank();
```

## Query syntax

The `query` parameter accepts either a **qs-style string** or a plain **object** — both are equivalent and normalized to the same internal structure.

```ts
type OperationQuery = string | { where: Record<string, any> };
```

### Simple condition

```ts
// string
query: 'where[status][equals]=published';

// object equivalent
query: {
  where: {
    status: {
      equals: 'published';
    }
  }
}
```

### Nested field

```ts
// string
query: 'where[attributes.featured][equals]=true'

// object equivalent
query: { where: { 'attributes.featured': { equals: true } } }
```

### AND / OR

`and` and `or` take arrays of conditions and can be nested arbitrarily.

```ts
// string
query: 'where[and][0][status][equals]=published&where[and][1][attributes.featured][equals]=true';

// object equivalent
query: {
  where: {
    and: [{ status: { equals: 'published' } }, { 'attributes.featured': { equals: true } }];
  }
}
```

```ts
// nested AND + OR
query: {
  where: {
    and: [
      { status: { equals: 'published' } },
      {
        or: [
          { 'attributes.featured': { equals: true } },
          { 'attributes.views': { greater_than: 1000 } }
        ]
      }
    ];
  }
}
```

The object format is especially useful when building queries programmatically. See the [REST API](/docs/04-api/01-rest-api.md#where) for the full list of supported operators.

## System operations

Call `.system()` before any method to mark the operation as a system operation, which bypasses certain access checks and hook guards.

```ts
await rime
  .collection('posts')
  .system()
  .create({
    data: { attributes: { title: 'Auto-generated' } }
  });
```

> [!INFO] This should be used with caution and is not recommended for general use, but can be useful in certain scenarios such as data migrations or automated scripts.

## locals

In addition to `rime`, `event.locals` exposes:

| Property | Type                | Description                    |
| -------- | ------------------- | ------------------------------ |
| `rime`   | `RimeContext`       | The main API instance          |
| `user`   | `User \| undefined` | The authenticated user, if any |
| `locale` | `string`            | The current locale             |
