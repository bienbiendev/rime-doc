Display a custom component.

```ts
import { component } from 'rimecms/fields';
import { Collection } from '$rime/config';

const Pages = Collection.create('pages', {
  fields: [
    //...
    component(Overview)
  ]
});
```

The component type:

```ts
Component<{
  path: string;
  config: ComponentField;
  form: DocumentFormContext<GenericDoc>;
}>;
```

An example component:

```svelte
<script lang="ts">
  import type { DocumentFormContext } from 'rimecms/types';
  import { Link } from '@lucide/svelte';

  const { form }: { form: DocumentFormContext } = $props();
</script>

{#if form.values.url}
  <a href={form.values.url} target="_blank">
    <Link size="12" />
    {form.values.url}
  </a>
{/if}

<style>
  a {
    border-radius: var(--rz-radius-md);
    gap: var(--rz-size-3);
    padding: var(--rz-size-1) var(--rz-size-3);
    border: 1px solid hsl(var(--rz-input-border-color));
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    letter-spacing: 0.02em;
  }
</style>
```
