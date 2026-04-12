A collection is a repeatable document type, defined by its `slug`, its fields and some properties. Based on those, API endpoints, types, and panel related pages are generated. Here is an example collection :

```ts
import { Collection } from '$rime/config';
import { text, richText } from 'rimecms/fields';
import { bold, link } from 'rimecms/fields/rich-text';

const Posts = Collection.create('posts', {
  fields: [
    //
    text('title').isTitle().required(),
    richText('content')
  ]
});
```

The slug that is passed as the first argument of `Collection.create` must be unique across all of your documents types.

## Properties

### $url {{server-only}}

A function that get the document as argument and return a string. When set this will generate a url property on documents.

### $hooks {{server-only}}

User defined hooks for operations fine grained control. [More](/docs/03-configuration/05-hooks.md)

```ts
import { Collection, Hooks } from '$rime/config';

const Posts = Collection.create('posts', {
  //...
  $hooks: {
    beforeRead: [
      Hooks.beforeRead<'posts'>(async (args) => {
        const doc = args.doc;
        // Do what you want with the document
        return { ...args, doc };
      })
    ]
  }
});
```

### access

Access rules for the collection.

```ts
import { Collection } from '$rime/config';

const Posts = Collection.create('posts', {
  // Default access
  access: {
    create: (user) => !!user && user.isStaff,
    read: (user) => !!user && user.isStaff,
    update: (user) => !!user && user.isStaff,
    delete: (user) => !!user && user.isStaff
  }
});
```

### auth

Authentication configuration. More

```ts
import { Collection } from '$rime/config';

const Users = Collection.create('users', {
  auth: true
});
```

### fields {!required!}

Collection fields definition [More](/docs/05-fields/00-overview.md)

### icon

The collection icon used inside the panel. Either a @lucide/svelte icon or a custom component with similar props.

### label

The collection label.

### live

Whether a document from the collection can be live edited. This require the `url` property to be defined.

### nested

Whether the collection has the nested feature enable. When enabled documents can have children and/or parent, this also enable tree reordering on the collection panel page.

### panel

Panel configuration : `panel.group` defines the navigation group, `panel.description` the description on the dashboard.

### upload

When enabled, a collection document will have a file upload feature.

### versions

Document version configuration.
