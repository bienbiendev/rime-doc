Rime has a built-in versioning system that keeps a history of every change made to a document. It can also be used to enable a **draft / publish workflow**.

Versions can be enabled on both collections and areas with the `versions` property:

```ts
// Simple — keep version history with defaults
const Posts = Collection.create('posts', {
  versions: true,
  fields: [...]
});

// With options
const News = Collection.create('news', {
  versions: {
    draft: true,
    maxVersions: 24,
  },
  fields: [...]
});
```

## Options

### draft

Enable a draft / publish workflow. When set to `true`, a hidden `status` field (`'draft'` | `'published'`) is automatically added to the document. Each update creates a new version rather than overwriting the current one, and a published version is always kept separate from a draft version.

```ts
versions: {
  draft: true;
}
```

> [!INFO] Draft versions are only accessible to authenticated panel users. Unauthenticated requests always receive the published version, regardless of `draft` or `versionId` parameters and if no published version exists then a `404` is returned.

### maxVersions

Maximum number of versions to retain per document. Older versions are pruned once the limit is reached. Defaults to `12`.

```ts
versions: {
  maxVersions: 24;
}
```

## Versioned documents

When versions are enabled, documents get an additional `versionId` property identifying the current version snapshot.

A secondary, queryable `{slug}_versions` collection is automatically registered and accessible through the API, allowing you to list the full version history of a document.

## Rime API

All version-related operations are available through the server-side Rime API.

```ts
// Get the published version (or latest draft if no published version exists)
const { docs } = await rime.collection('news').find();

// Get the latest draft version
const { docs } = await rime.collection('news').find({ draft: true });

// Get a document by id — returns published version by default
const { doc } = await rime.collection('news').findById({ id: '123' });

// Get a specific version snapshot
const { doc } = await rime.collection('news').findById({ id: '123', versionId: 'abc' });

// Create a new draft version
const { doc } = await rime.collection('news').updateById({
  id: '123',
  draft: true,
  data: { attributes: { title: 'New draft title' } }
});

// Publish a specific version
const { doc } = await rime.collection('news').updateById({
  id: '123',
  versionId: draftVersionId,
  data: { status: 'published' }
});
```

## REST API

All the standard [REST API](/docs/04-api/01-rest-api.md) endpoints are available on versioned documents, with the following additional query parameters: `versionId` to target a specific version snapshot (returns `404` if not found), and `draft=true` to read or write draft versions.

| Method  | URI                           | Action                        |
| ------- | ----------------------------- | ----------------------------- |
| `GET`   | `/api/settings`               | Get the published version     |
| `GET`   | `/api/settings?draft=true`    | Get the latest draft          |
| `GET`   | `/api/settings?versionId=abc` | Get a specific version        |
| `GET`   | `/api/news_versions`          | List the full version history |
| `PATCH` | `/api/settings?draft=true`    | Create a new draft            |
| `PATCH` | `/api/settings?versionId=abc` | Update a specific version     |
