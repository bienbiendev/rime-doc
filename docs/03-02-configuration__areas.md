An area is a singleton document type, defined by its `slug`, its fields and some properties. Based on those, API endpoints, types, and panel related pages are generated. Here is an example area :

```ts
import { Area } from '$rime/config';
import { text, toggle } from 'rimecms/fields';

const Settings = Area.create('settings', {
  fields: [
    //
    text('siteTitle').required(),
    toggle('maintenance')
  ]
});
```

The slug, passed as the first argument of `Area.create` must be unique across all of your documents.

## Properties

### $hooks {{server-only}}

User defined hooks for operations fine grained control.

### $url {{server-only}}

A function that get the document as argument and return a string.

### access

Access rules for this area.

### fields {!required!}

Area fields definition. [More](/docs/04-00-fields.md).

### icon

The area icon used inside the panel. Either a @lucide/svelte icon or a custom component with similar props.

### label

Area label.

### live

Whether a the document can be live edited. This require the `url` property to be defined.

### panel

Panel configuration : `panel.group` defines the navigation group, `panel.description` the description on the dashboard.

### versions

Document version configuration.
