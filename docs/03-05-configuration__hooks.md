# Hooks

Rime provides various hooks that allow you to control operations throughout your application. Here's how you create a basic hook:

```ts
const pagesBeforeUpdate = Hooks.beforeUpdate<'pages'>((args) => {
  if (args.params.id === 'some-id') {
    args.data.title = 'OMG a mutation';
  }
  return args;
});
```

Hooks receive an object as their argument containing the following properties:

| Property  | Description                                                                        |
| --------- | ---------------------------------------------------------------------------------- |
| event     | The current SvelteKit RequestEvent                                                 |
| context   | The operation context [learn more](#operation-context)                             |
| config    | The document configuration                                                         |
| operation | The operation type: `create`, `read`, `update`, or `delete`                        |
| data      | The data being processed (only available for `update` and `create` operations)     |
| doc       | The existing document before the operation (not available for `create` operations) |

## beforeOperation

The `beforeOperation` hook is a special hook that's shared by both collections and areas. It triggers before any operation runs, right after the document access control check passes.

```ts
import { Collection, Hooks } from '$rime/config';

const Posts = Collection.create('posts', {
  //...
  $hooks: {
    beforeOperation: [
      Hooks.beforeOperation(async (args) => {
        const { event } = args;
        event.locals.brew = new Brew();
        return { ...args, event };
      })
    ]
  }
});
```

The `beforeOperation` hook receives an object with these properties:

| Property  | Description                                                 |
| --------- | ----------------------------------------------------------- |
| event     | The current SvelteKit RequestEvent                          |
| context   | The operation context ([learn more](#operation-context))    |
| config    | The document configuration                                  |
| operation | The operation type: `create`, `read`, `update`, or `delete` |

## Area Hooks

Areas support these specific hooks: `beforeRead`, `beforeUpdate`, and `afterUpdate`:

```ts
import { Area } from '$rime/config';

const Settings = Area.create('settings', {
  //...
  $hooks: {
    beforeRead: [
      /** */
    ],
    beforeUpdate: [
      /** */
    ],
    afterUpdate: [
      /** */
    ]
  }
});
```

## Collection Hooks

Collections support a comprehensive set of hooks: `beforeOperation`, `beforeCreate`, `beforeRead`, `beforeUpdate`, `beforeDelete`, `afterCreate`, `afterUpdate`, and `afterDelete`:

```ts
import { Collection, Hooks } from '$rime/config';

const Posts = Collection.create('posts', {
  //...
  $hooks: {
    beforeOperation: [],
    beforeCreate: [],
    beforeRead: [],
    beforeUpdate: [],
    beforeDelete: [],
    afterCreate: [],
    afterUpdate: [],
    afterDelete: []
  }
});
```

## Operation Context

The operation context is provided as part of each hook's arguments. It's an object that contains:

| Property          | Description                                                       |
| ----------------- | ----------------------------------------------------------------- |
| params            | All parameters that were passed to the original operation method  |
| versionOperation  | The type of version operation being performed                     |
| originalDoc       | The original document (only available during `update` operations) |
| isSystemOperation | Indicates whether the operation was triggered by the system       |
| isFallbackLocale  | Indicates whether this is a localized fallback update operation   |
