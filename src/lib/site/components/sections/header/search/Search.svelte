<script lang="ts">
  import Button from '$lib/site/components/ui/button/Button.svelte';
  import * as Command from '$lib/site/components/ui/command/index.js';
  import * as Dialog from '$lib/site/components/ui/dialog/index.js';
  import Shortcut from '$lib/site/components/ui/shortcut/Shortcut.svelte';
  import { Search } from '@lucide/svelte';

  import type { JSONContent } from '@tiptap/core';
  import { onMount } from 'svelte';
  import type { SearchIndex } from './type';

  // type Props = {  }
  // const { }: Props = $props()

  let searchOpen = $state(false);
  let isLoading = $state(true);
  let query = $state('');
  let pages = $state<PagesDoc[]>([]);
  let searchIndex = $state<SearchIndex>([]);
  let results = $state<SearchIndex>([]);
  let previousQuery = '';

  const richTextJSONToText = (value: string | JSONContent): string => {
    if (!value) return '';
    let textValue: string;
    const renderNodes = (nodes: { [k: string]: any }) => {
      return nodes
        .map((node: { text?: string; [k: string]: any }) => {
          if (node.type === 'codeBlock') return '';
          if ('text' in node) {
            return node.text;
          } else if ('content' in node) {
            return renderNodes(node.content);
          }
        })
        .join(' ');
    };

    try {
      const jsonContent = typeof value === 'string' ? JSON.parse(value) : value;
      textValue = renderNodes(jsonContent.content);
    } catch (err) {
      console.error(err);
      textValue = JSON.stringify(value);
    }
    return textValue;
  };

  function getOccurrences(content: string, search: string): string[] {
    if (!search || !content) return [];

    const words = content.split(/\s+/);

    // Build the character offset of each word's start
    const offsets: number[] = [];
    let pos = 0;
    for (const word of words) {
      offsets.push(pos);
      pos += word.length + 1; // +1 for the whitespace separator
    }

    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'gi');
    const occurrences: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      const matchStart = match.index;
      const matchEnd = match.index + match[0].length;

      // Last word whose offset is ≤ matchStart
      let startWord = 0;
      for (let i = offsets.length - 1; i >= 0; i--) {
        if (offsets[i] <= matchStart) {
          startWord = i;
          break;
        }
      }

      // Last word whose offset is < matchEnd (handles multi-word matches)
      let endWord = startWord;
      for (let i = offsets.length - 1; i >= 0; i--) {
        if (offsets[i] < matchEnd) {
          endWord = i;
          break;
        }
      }

      const from = Math.max(0, startWord - 4);
      const to = Math.min(words.length, endWord + 1 + 12);
      const snippet = words.slice(from, to).join(' ');
      const highlighted = snippet.replace(
        new RegExp(escaped, 'gi'),
        (m) => `<span class="highlight">${m}</span>`
      );
      occurrences.push(highlighted);
    }

    return occurrences;
  }

  onMount(async () => {
    pages = await fetch('/api/search.json').then((res) => res.json());
    for (const page of pages) {
      if (!page.url) continue;
      searchIndex.push({
        id: page.id,
        title: page.attributes.longTitle || page.attributes.title!,
        keywords: [
          page.attributes.longTitle || page.attributes.title!,
          ...(page.attributes.categories || [])
        ],
        content: richTextJSONToText(page.content.text || ''),
        summary: page.attributes.summary || '',
        url: page.url
      });
    }
    isLoading = false;
  });

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      searchOpen = true;
    }
  }

  function customFilter(commandValue: string, search: string, commandKeywords?: string[]): number {
    let score = 0;
    if (commandKeywords) {
      for (const [index, keyword] of commandKeywords.entries()) {
        if (keyword.includes(search)) {
          score += (commandKeywords.length - index) * 0.1;
        }
      }
    }
    const matches = commandValue.matchAll(new RegExp(search, 'gi'));
    for (const match of matches) {
      score += 0.01;
    }
    return score;
  }

  $effect(() => {
    if (previousQuery !== query) {
      results = searchIndex
        .map((item) => ({
          ...item,
          content: getOccurrences(item.content, query).slice(0, 3).join(' ... '),
          score: customFilter(item.content, query, item.keywords)
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
      <Button variant="secondary" {...props} --border-radius="var(--size-1)">
        <Search size="12" /> Search <span></span>
        <Shortcut>K</Shortcut>
      </Button>
    {/snippet}
  </Dialog.Trigger>

  <Dialog.Portal>
    <Dialog.Overlay class="dialog-overlay" />
    <Dialog.Content size="lg" class="dialog-content">
      <Command.Root shouldFilter={false} filter={customFilter}>
        <Command.Input bind:value={query} />
        <Command.List>
          <Command.Viewport>
            {#if query}
              <Command.Empty>No results found.</Command.Empty>
              {#each results as item (item.id)}
                <Command.LinkItem
                  onSelect={() => (searchOpen = false)}
                  keywords={item.keywords}
                  value={item.content}
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
