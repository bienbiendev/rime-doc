<script lang="ts">
  type Props = {
    title: string;
    uptitle?: string;
    link: string;
    align?: 'left' | 'right';
  };
  const { title, uptitle, link, align = 'left' }: Props = $props();
</script>

<a class="card-pagination" class:text-right={align === 'right'} href={link}>
  <div class="content">
    {#if uptitle}
      <p>{uptitle}</p>
    {/if}
    <h3>{title}</h3>
  </div>
</a>

<style lang="postcss">
  .card-pagination {
    border: 1px solid var(--color-border);
    border-radius: var(--size-2);
    background-color: color-mix(in oklch, var(--color-bg) 88%, white);
    padding: var(--size-4);
    width: 320px;
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

  .content {
    flex: 1;
    min-width: 0;
  }

  h3 {
    font-size: var(--font-size-text-sm);
    margin-top: var(--size-1);
  }

  p {
    font-size: var(--font-size-text-xs);
    opacity: 0.4;
    line-height: 1.3;
    text-wrap: balance;
  }
</style>
