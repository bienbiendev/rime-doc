<script lang="ts">
  import { page } from '$app/state';
  import { PUBLIC_RIME_URL } from '$env/static/public';
  import Button from '$lib/site/components/ui/button/Button.svelte';
  import Search from '../header/search/Search.svelte';

  type Props = { nav: NavDoc };
  const { nav }: Props = $props();
</script>

<div class="nav-wrapper">
  <nav>
    <Search />
    {#each nav.main as group, index (group.id)}
      {#if group._children.length}
        <p class="nav-group-label">{group.label}</p>
        <ul>
          {#each group._children || [] as child, index (index)}
            {#if child.pages?.url}
              <li>
                <Button
                  size="sm"
                  variant={child.pages?.url === page.url.href ? 'secondary' : 'ghost'}
                  href={child.pages.url?.replace(PUBLIC_RIME_URL, '')}
                >
                  {child.label}
                </Button>
              </li>
            {/if}
          {/each}
        </ul>
      {:else}
        <Button
          size="sm"
          variant={group.pages?.url === page.url.href ? 'secondary' : 'ghost'}
          href={group.pages?.url?.replace(PUBLIC_RIME_URL, '')}
        >
          {group.label}
        </Button>
      {/if}
    {/each}
  </nav>
</div>

<style>
  .nav-wrapper {
    height: calc(100vh - var(--header-height));
    display: none;
    @media (min-width: 768px) {
      display: block;
    }
  }

  nav {
    --button-border-radius: var(--size-1);
    padding: var(--size-8) var(--size-8);
    position: fixed;
    top: var(--header-height);
    bottom: 0;
    width: 240px;
    overflow-y: auto;
    gap: var(--size-1);
    display: grid;
    > ul {
      margin-top: var(--size-1);
      display: grid;
      gap: var(--size-1);
    }
    :global(.button) {
      font-size: var(--font-size-text-sm);
      width: 100%;
      font-variation-settings: 'wght' 400;
      padding-left: var(--size-2);
      margin-left: calc(-1 * var(--size-2));
      justify-content: flex-start;
    }
  }

  .nav-group-label {
    text-transform: uppercase;
    font-size: var(--font-size-text-2xs);
    letter-spacing: 0.13em;
    opacity: 0.5;
    margin-top: var(--size-6);
    display: block;
  }
</style>
