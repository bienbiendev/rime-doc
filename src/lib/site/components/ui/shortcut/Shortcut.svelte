<script lang="ts">
  import { Command } from '@lucide/svelte';
  import type { Snippet } from 'svelte';

  type Props = { children: Snippet };
  const { children }: Props = $props();
</script>

<span><Command size="10" />{@render children()}</span>

<style lang="postcss">
  span {
    opacity: 0.6;
    border: 1px solid oklch(var(--light-6) 0 0);
    padding: var(--size-0-5) var(--size-1);
    font-size: var(--font-size-text-xs);
    letter-spacing: 0.1em;
    border-radius: var(--size-1);
    display: flex;
    align-items: center;
    gap: var(--size-0-5);
  }
</style>
