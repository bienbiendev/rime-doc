<script lang="ts">
  import type { WithElementRef, WithoutChildren } from 'bits-ui';
  import type { HTMLInputAttributes } from 'svelte/elements';

  type PrimitiveInputAttributes = WithElementRef<HTMLInputAttributes>;

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    ...restProps
  }: WithoutChildren<PrimitiveInputAttributes> = $props();
</script>

<input bind:this={ref} class="input {className}" bind:value {...restProps} />

<style type="postcss">
  .input {
    border: var(--border);
    background-color: var(--color-input);
    display: flex;
    height: var(--size-11);
    width: 100%;
    border-radius: var(--radius-md);
    transition: all 0.1s ease-in-out;
    font-size: var(--font-size-text-sm);
    padding: var(--size-1) var(--size-3);
  }

  input.input:is(:-webkit-autofill, :autofill) {
    --color: color-mix(in oklch, var(--color-input), var(--color-primary) 12%);
    background-color: var(--color) !important;
    box-shadow: 0 0 0 1000px var(--color) inset !important;
    color: var(--color-fg) !important;
    -webkit-text-fill-color: var(--color-fg) !important;
  }
  input.input:is(:-webkit-autofill, :autofill):focus {
    --color: color-mix(in lch, var(--color-input), var(--color-primary) 24%);
    background-color: var(--color) !important;
    box-shadow: 0 0 0 1000px var(--color) inset !important;
    color: var(--color-fg) !important;
    -webkit-text-fill-color: var(--color-fg) !important;
  }

  .input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .input::placeholder {
    @mixin color color-fg, 0.5;
  }

  .input:focus-visible {
    outline: none;
    @mixin ring var(--color-ring);
  }

  .input[data-error] {
    outline: none;
    @mixin ring var(--color-warn);
  }
</style>
