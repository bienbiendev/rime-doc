Rime auto-generates REST API endpoints for every collection and area defined in your configuration. All endpoints are prefixed with `/api`.

## Collections

| Method   | URI                                | Action                    |
| -------- | ---------------------------------- | ------------------------- |
| `GET`    | `/api/{collection}`                | List documents            |
| `GET`    | `/api/{collection}/{id}`           | Get a single document     |
| `POST`   | `/api/{collection}`                | Create a document         |
| `PATCH`  | `/api/{collection}/{id}`           | Update a document         |
| `DELETE` | `/api/{collection}/{id}`           | Delete a document         |
| `DELETE` | `/api/{collection}`                | Delete multiple documents |
| `POST`   | `/api/{collection}/{id}/duplicate` | Duplicate a document      |

## Areas

| Method  | URI           | Action                   |
| ------- | ------------- | ------------------------ |
| `GET`   | `/api/{area}` | Get the area document    |
| `PATCH` | `/api/{area}` | Update the area document |

## Query parameters

### where

Filter results using the `where[field][operator]=value` syntax.

```
GET /api/posts?where[status][equals]=published
GET /api/posts?where[attributes.title][like]=hello
GET /api/posts?where[and][0][status][equals]=published&where[and][1][featured][equals]=true
```

Available operators:

| Operator                 | Description                           |
| ------------------------ | ------------------------------------- |
| `equals`                 | Exact match                           |
| `not_equals`             | Inequality                            |
| `like`                   | Case-insensitive substring            |
| `not_like`               | Excludes substring                    |
| `in_array`               | Matches any of a comma-separated list |
| `not_in_array`           | Excludes a comma-separated list       |
| `greater_than`           | `>`                                   |
| `greater_than_or_equals` | `>=`                                  |
| `less_than`              | `<`                                   |
| `less_than_or_equals`    | `<=`                                  |
| `between`                | Range: `?where[age][between]=18,65`   |
| `not_between`            | Outside range                         |
| `is_null`                | Field is null                         |
| `is_not_null`            | Field is not null                     |

### sort

Sort by a field name. Prefix with `-` for descending order.

```
GET /api/posts?sort=-createdAt
GET /api/posts?sort=attributes.title
```

### limit / offset

Paginate results.

```
GET /api/posts?limit=10&offset=20
```

### depth

Controls how deeply nested relations are populated. Defaults to `0` (relations returned as `{ relationTo, documentId }`). Accepts values from `0` to `6`.

```
GET /api/posts?depth=1
```

### select

Return only the specified fields. `id` is always included.

```
GET /api/posts?select=attributes.title,attributes.slug
```

### locale

Set the locale context for localized fields.

```
GET /api/posts?locale=fr
```

## Responses

**List:** `{ docs: Doc[] }`

**Single document / create / update:** `{ doc: Doc }`

**Delete single:** `{ id: string }`

**Delete multiple / duplicate:** `{ docs: { id: string }[] }`

Validation errors return `400`. Access denied returns `403`. Not found returns `404`.

## Access control

Each endpoint is gated by the `access` rules defined on the collection or area. Requests that fail access checks return `403`. Unauthenticated requests are treated as if `user` is `undefined`, so public endpoints simply need `read: () => true`.
