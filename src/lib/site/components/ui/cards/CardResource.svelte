<script lang="ts">
  import { ChevronLeft, ChevronRight } from '@lucide/svelte';

  type Props = {
    title: string;
    description?: string;
    link: string;
    direction?: 'ltr' | 'rtl';
    align?: 'left' | 'right';
  };
  const { title, description, link, direction = 'ltr', align }: Props = $props();

  // Case 1: default (ltr) :      [text     ->]
  // Case 2a: rtl :               [<- text    ]
  // Case 2b: ltr + align right   [    text ->]
  const Chevron = $derived(direction === 'rtl' ? ChevronLeft : ChevronRight);
</script>

<a class="card-resource" class:text-right={align === 'right'} style:direction href={link}>
  <div class="content">
    <h3>{title}</h3>
    {#if description}
      <p>{description}</p>
    {/if}
  </div>
  <Chevron size="12" />
</a>

<style lang="postcss">
  .card-resource {
    border: 1px solid var(--color-border);
    border-radius: var(--size-2);
    background-color: color-mix(in oklch, var(--color-bg) 88%, white);
    padding: var(--size-5);
    min-width: 320px;
    display: flex;
    gap: var(--size-3);
    align-items: center;
    text-decoration: none;
    color: inherit;
    text-align: left;

    &.text-right {
      text-align: right;
    }
  }

  .card-resource:hover {
    border-color: oklch(from var(--color-border) calc(l * 0.97) c h);
  }
  .card-resource:hover:is(:global(.dark) .card-resource) {
    border-color: oklch(from var(--color-border) calc(l * 1.2) c h);
  }

  :global(.card-resource:has(+ .card-resource)),
  :global(.card-resource + .card-resource) {
    margin-block: var(--size-0);
  }

  .content {
    flex: 1;
    min-width: 0;
  }

  h3 {
    @mixin font-title;
    font-size: var(--font-size-text-sm);
    margin: 0;
  }

  p {
    font-size: var(--font-size-text-xs);
    color: oklch(var(--light-11) 0 0);
    line-height: 1.3;
    margin-top: var(--size-2);
    text-wrap: balance;
  }
</style>
