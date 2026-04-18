<script lang="ts">
  import { Search } from '@lucide/svelte';
  import { Command as CommandPrimitive } from 'bits-ui';

  let {
    ref = $bindable(null),
    class: className,
    value = $bindable(''),
    ...restProps
  }: CommandPrimitive.InputProps = $props();
</script>

<div class="command-input" data-command-input-wrapper="">
  <Search class="command-input__icon" size={12} />
  <CommandPrimitive.Input
    class="command-input__input {className}"
    bind:ref
    {...restProps}
    bind:value
  />
</div>

<style type="postcss">
  .command-input {
    background-color: var(--color-bg--accent);
    display: flex;
    align-items: center;
    border-top-left-radius: var(--radius-md);
    border-top-right-radius: var(--radius-md);
    padding-inline: var(--size-3);
    padding-block: var(--size-1);

    &:global([data-focused]) {
      @mixin ring var(--color-ring);
    }

    &:global([data-error]) {
      @mixin ring var(--color-alert);
    }

    & :global(.command-input__icon) {
      margin-right: var(--size-2);
      flex-shrink: 0;
      opacity: 0.5;
    }

    & :global(.command-input__input) {
      display: flex;
      height: var(--size-10);
      width: 100%;
      background-color: transparent;
      font-size: var(--text-sm);
      outline: none;
    }

    & :global(.command-input__input::placeholder) {
      color: hsl(from var(--color-fg) h s l / 0.7);
    }

    & :global(.command-input__input:disabled) {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
</style>
