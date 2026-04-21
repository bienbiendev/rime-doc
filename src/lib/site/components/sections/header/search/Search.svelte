<script lang="ts">
  import Button from '$lib/site/components/ui/button/Button.svelte';
  import * as Command from '$lib/site/components/ui/command/index.js';
  import * as Dialog from '$lib/site/components/ui/dialog/index.js';
  import Shortcut from '$lib/site/components/ui/shortcut/Shortcut.svelte';
  import { Search } from '@lucide/svelte';

  import { onMount } from 'svelte';
  import { createSearchIndex, getOccurrences } from './search';
  import type { SearchIndex } from './type';

  // , so instead of dummy add previous/next n words, it break at line breaks : like 4 words max before the occurence untile linebreak, and 8 words max after until line-break
  // type Props = {  }
  // const { }: Props = $props()

  let searchOpen = $state(false);
  let isLoading = $state(true);
  let query = $state('');
  let pages = $state<PagesDoc[]>([]);
  let searchIndex = $state<SearchIndex>([]);
  let results = $state<SearchIndex>([]);
  let previousQuery = '';

  onMount(async () => {
    pages = await fetch('/api/search.json').then((res) => res.json());
    searchIndex = createSearchIndex(pages);
    isLoading = false;
  });

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      searchOpen = true;
    }
  }

  function computeScore(item: SearchIndex[number], search: string): number {
    let score = 0;
    if (item.keywords) {
      for (const [index, keyword] of item.keywords.entries()) {
        if (keyword.includes(search)) {
          score += item.weight * (item.keywords.length - index) * 0.1;
        }
      }
    }
    const matches = item.content.matchAll(new RegExp(search, 'gi'));
    score += Array.from(matches || []).length * item.weight * 0.01;
    return score;
  }

  $effect(() => {
    if (previousQuery !== query) {
      results = searchIndex
        .map((item) => ({
          ...item,
          content: getOccurrences(item.content, query).slice(0, 2).join(' ... '),
          score: computeScore(item, query)
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);

      previousQuery = query;
    }
  });
</script>

<svelte:document onkeydown={handleKeydown} />

<Dialog.Root bind:open={searchOpen}>
  <Dialog.Trigger>
    {#snippet child({ props })}
      <Button class="search-trigger" variant="secondary" {...props} --border-radius="var(--size-1)">
        <Search size="12" /> Search <span></span>
        <Shortcut>K</Shortcut>
      </Button>
    {/snippet}
  </Dialog.Trigger>

  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content size="lg" class="search-dialog-content">
      <Command.Root shouldFilter={false}>
        <Command.Input bind:value={query} class="search-command-input" />
        <Command.List>
          <Command.Viewport>
            {#if query}
              <Command.Empty>No results found.</Command.Empty>
              {#each results as item (item.id)}
                <Command.LinkItem
                  onSelect={() => (searchOpen = false)}
                  keywords={item.keywords}
                  value={item.url}
                  href={item.url}
                >
                  <span>{item.title}</span>
                  <span>{@html item.content}</span>
                </Command.LinkItem>
              {/each}
            {/if}
          </Command.Viewport>
        </Command.List>
      </Command.Root>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style lang="postcss">
  span {
    flex: 2;
  }
  :global {
    .button.search-trigger {
      --button-border-radius: var(--size-1);
      background-color: hsl(from var(--color-bg--accent) h s l / 0.8);
      font-variation-settings: 'wght' 400;
      font-weight: 400;
      min-width: 33vw;
      backdrop-filter: blur(3px);
    }
    .search-dialog-content {
      background-color: none;
      transform: translate(-50%, 0%);
      top: 20%;
    }

    .command-link-item {
      display: grid;
      gap: 0;
      > span:first-child {
        font-weight: 600;
        font-variation-settings: 'wght' 600;
      }
      > span:last-child {
        font-size: var(--font-size-text-xs);
        opacity: 0.4;
        .highlight {
          background-color: var(--color-primary);
          color: var(--color-primary-fg);
          padding: 0 2px;
          border-radius: var(--size-1);
        }
      }
    }
  }
</style>
