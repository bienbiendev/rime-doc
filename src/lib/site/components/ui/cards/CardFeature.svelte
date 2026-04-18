<script lang="ts">
  import type { IconProps } from '@lucide/svelte';
  import type { Component } from 'svelte';

  type Props = {
    title: string;
    uptitle?: string;
    description: string;
    link: string;
    icon: Component<IconProps>;
  };
  const { title, uptitle, icon, description, link }: Props = $props();
  const Icon = $derived(icon);
</script>

<a class="card-feature" href={link}>
  <div class="content">
    <div class="icon">
      <Icon strokeWidth={1} size="12" />
    </div>
    <div>
      <p class="uptitle">{uptitle}</p>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  </div>
</a>

<style lang="postcss">
  .card-feature {
    border: 1px solid var(--color-border);
    border-radius: var(--size-2);
    background-color: color-mix(in oklch, var(--color-bg) 88%, white);
    padding: var(--size-6);
    display: flex;
    gap: var(--size-3);
    align-items: center;
    text-decoration: none;
    color: inherit;
    text-align: left;
    height: 100%;
  }

  .content {
    container-type: inline-size;
    flex: 1;
    min-width: 0;
    display: grid;
    gap: var(--size-8);

    .icon {
      --size: clamp(1.5rem, 16cqi, 2rem);
      width: var(--size);
      height: var(--size);
      padding: var(--size-2);
      background-color: hsl(from var(--color-fg) h s l / 0.1);

      border-radius: var(--size-1);
      :global(svg) {
        height: 100%;
        width: 100%;
      }
    }
  }

  .uptitle {
    font-size: var(--font-size-text-xs);
    margin-bottom: var(--size-2);
  }

  h3 {
    font-size: var(--font-size-headline-md);
    @mixin font-title;
    margin-top: var(--size-1);
    margin-bottom: var(--size-3);
  }

  p {
    font-size: var(--font-size-text-sm);
    opacity: 0.7;
    line-height: 1.3;
    text-wrap: balance;
  }
</style>
