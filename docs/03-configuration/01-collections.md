<!-- Summary: Learn how to define collections — repeatable document types that generate API endpoints, TypeScript types, and panel pages. -->

A collection is a repeatable document type, defined by its `slug`, its fields and some properties. Based on those, API endpoints, types, and panel related pages are generated. Here is an example collection :

```ts
import { env } from '$env/dynamic/public';
import { Collection } from '$rime/config';
import { richText, slug, tab, tabs, text, textarea, toggle } from 'rimecms/fields';
import { bold, bulletList, heading, link, upload } from 'rimecms/fields/rich-text';

const tabAttributes = tab('attributes')
  .label('Attributes')
  .fields(
    text('title').isTitle(),
    toggle('isHome'),
    slug('slug')
      .slugify('attributes.title')
      .condition((_, siblings) => siblings.isHome === false),
    textarea('summary')
  );

const tabContent = tab('content')
  .label('Content')
  .fields(
    richText('text').features(
      heading(2, 3, 4),
      bold(),
      link(),
      bulletList(),
      upload({ source: 'medias' })
    )
  );

export const pages = Collection.create('pages', {
  access: {
    read: () => true
  },
  $url: (doc) =>
    doc.attributes.isHome
      ? `${env.PUBLIC_RIME_URL}/`
      : `${env.PUBLIC_RIME_URL}/docs/[...parent.attributes.slug]/${doc.attributes.slug}`,
  fields: [tabs(tabAttributes, tabContent)]
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

Whether a document from the collection can be live edited. To enable live editing, the collection must have a `$url` property defined, and `live` set to true. Then you'll need to adapt your front-end to use the consumer and provider components as follow:

```svelte
<!-- @file:src/routes/(front)/+layout.svelte -->
<script lang="ts">
  import { LiveProvider } from 'rimecms';
  const { children } = $props();
</script>

<LiveProvider>
  {@render children()}
</LiveProvider>
```

```svelte
<!-- @file:src/routes/(front)/+page.svelte -->
<script lang="ts">
  import { LiveEdit } from 'rimecms';
  let { data } = $props();
</script>

<LiveEdit path="attributes.title" data={data.doc.attributes.title}>
  {#snippet child(title, props)}
    <h1 {...props}>{title}</h1>
  {/snippet}
</LiveEdit>
```

The `LiveEdit` component will automatically subscribe to the document changes and update the content in real time. The `path` prop is the path to the field from the document data root, and the `data` prop is the initial value of the field. The `LiveEdit` component will also provide a `props` object to the child component, which contains the necessary props to allow your wrapper to toggle the live panel.

An update prop can be passed to edit any other resource than the document itself. For example, if you want to edit a `footer` area at `/api/footer` in a page, you can do it like this:

```svelte
<LiveEdit path="title" update="/footer" data={data.footer.title}>
  {#snippet child(title, props)}
    <h3 {...props}>{title}</h3>
  {/snippet}
</LiveEdit>
```

By default the `update` prop will use the `data.doc` as the resource to update, be sure to provide the `data.doc` from your page data. The path prop by default is `""` mapping to the root of the document data. This provides the whole document form on the sidepanel.

```svelte
<LiveEdit path="" update="/{data.doc._type}/{data.doc._id}" data={data.doc}>
  {#snippet child(doc, props)}
    <h1 {...props}>{doc.attributes.title}</h1>
  {/snippet}
</LiveEdit>

<!-- Is equivalent to -->
<LiveEdit>
  {#snippet child(doc: PagesDoc, props)}
    <h1 {...props}>{doc.attributes.title}</h1>
  {/snippet}
</LiveEdit>
```

`LiveEdit` components can also be nested.

```svelte
<LiveEdit data={data.doc}>
  {#snippet child(doc, props)}
    <section {...props}>
      <h1>{doc.attributes.title}</h1>

      <LiveEdit path="attributes.summary" data={doc.attributes.summary}>
        {#snippet child(summary, props)}
          <p {...props}>{summary}</p>
        {/snippet}
      </LiveEdit>

      <!-- This allows a whole blocks field to be editable -->
      <LiveEdit path="layout.sections" data={doc.layout.sections}>
        {#snippet child(sections, props)}
          <div {...props}>
            {#each sections as block, index}
              <!-- This allows a single block to be editable -->
              <LiveEdit path="layout.sections.{index}:{block.type}" data={block}>
                {#snippet child(block, props)}
                  <div {...props}>{block.text}</div>
                {/snippet}
              </LiveEdit>
            {/each}
          </div>
        {/snippet}
      </LiveEdit>
    </section>
  {/snippet}
</LiveEdit>
```

> [!INFOS] This functionality is experimental.

### nested

Whether the collection has the nested feature enable. When enabled documents can have children and/or parent, this also enable tree reordering on the collection panel page.

### panel

Panel configuration : `panel.group` defines the navigation group, `panel.description` the description on the dashboard.

### upload

When enabled, a collection document will have a file upload feature.

### versions

Document version configuration.
