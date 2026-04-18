<script lang="ts">
  import type { WithElementRef } from 'bits-ui';
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} class="dialog-header {className}" {...restProps}>
  {@render children?.()}
</div>

<style type="postcss">
  .dialog-header {
    display: flex;
    flex-direction: column;
    gap: var(--rz-size-1-5);
    text-align: center;
    font-weight: 600;
  }

  @media (min-width: 640px) {
    .dialog-header {
      text-align: left;
    }
  }
</style>
