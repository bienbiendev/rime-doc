<!-- Summary: Step-by-step walkthrough for building a custom field type — a `color` field, from builder to panel component to usage. -->

For the field builder API reference (`dataType`, `component`, `cell`, `generateType`, shared hooks, ...), see [Define your own field](/docs/05-fields/00-overview.md#define-your-own-field). This guide just walks through using it, building a `color` field storing a hex string — laid out the same way built-in fields are: one folder per field, with an isomorphic `index.ts` and a `component/` directory for the panel UI.

1. The field builder

```ts
// @file:src/lib/fields/color/index.ts
import { FormFieldBuilder } from 'rimecms/fields';
import type { FormField } from 'rimecms/types';
import Cell from './component/Cell.svelte';
import Color from './component/Color.svelte';

export class ColorFieldBuilder extends FormFieldBuilder<ColorField> {
  constructor(name: string) {
    super(name, 'color');
    this.field.validate = (value: unknown) =>
      (typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)) || 'Should be a valid hex color';
  }

  get dataType(): 'text' {
    return 'text';
  }

  get component() {
    return Color;
  }

  get cell() {
    return Cell;
  }

  protected override generateType(): string {
    return `${this.name}${this.get.required ? '' : '?'}: string`;
  }
}

export const color = (name: string) => new ColorFieldBuilder(name);

export interface ColorField extends FormField {
  type: 'color';
}
```

`FormFieldBuilder` also gives you `.required()`, `.hint()`, `.label()`, `.localized()`, `.condition()`, `.access()`, `.onChange()`, `.$beforeRead()`, `.$beforeSave()` and `.beforeValidate()` — see the [shared field methods](/docs/05-fields/00-overview.md#fields-shared-methods).

2. The panel component

```svelte
<!-- @file:src/lib/fields/color/component/Color.svelte -->
<script lang="ts">
  import { Field } from 'rimecms/panel';
  import type { DocumentFormContext } from 'rimecms/types';
  import type { ColorFieldBuilder } from '../index.js';

  const {
    path,
    config,
    form
  }: { path: string; config: ColorFieldBuilder; form: DocumentFormContext } = $props();

  const field = $derived(form.useField<string>(path, config));
</script>

<fieldset class="rz-color-field" use:Field.fieldset={field}>
  <Field.Label {config} for={path} />
  <input
    type="color"
    id={path}
    value={field.value}
    oninput={(event) => (field.value = event.currentTarget.value)}
  />
  <Field.Hint {config} />
  <Field.Error error={field.error} />
</fieldset>
```

```svelte
<!-- @file:src/lib/fields/color/component/Cell.svelte -->
<script lang="ts">
  const { value }: { value: string | null } = $props();
</script>

{#if value}
  <span class="rz-color-cell" style:background-color={value}></span>
{/if}

<style lang="postcss">
  .rz-color-cell {
    display: inline-block;
    width: var(--rz-size-4);
    height: var(--rz-size-4);
    border-radius: var(--rz-radius-full);
  }
</style>
```

3. Use it

```ts
import { color } from '$lib/fields/color/index.js';
import { Collection } from '$rime/config';

const Pages = Collection.create('pages', {
  fields: [
    //...
    color('accent').required().hint('Used for the header background').table()
  ]
});
```

Need a hook whose real implementation only makes sense server-side, or that behaves differently client/server? See [Fields shared methods](/docs/05-fields/00-overview.md#fields-shared-methods) in the fields reference.

## Publishing it as a package

See [Authoring a package](/docs/06-guide/04-authoring-a-package.md).
