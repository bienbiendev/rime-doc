<script lang="ts">
  import { TableOfContents } from '@lucide/svelte';
  import type { JSONContent } from '@tiptap/core';
  import { richTextJSONToText } from 'rimecms/fields/rich-text';
  import { string } from 'rimecms/util';

  type Props = { text: JSONContent | undefined };
  type HeadingNode = {
    attrs: {
      level: number;
    };
    content: { text: string }[];
  };

  const { text }: Props = $props();

  let elements = $state<NodeListOf<HTMLHeadingElement>>();
  let activeIndex = $state(0);
  let visibleElements = new Set<Element>();

  const isHeadingNode = (node: JSONContent): node is HeadingNode =>
    Array.isArray(node.content) && !!node.content[0] && !!node.content[0].text;

  const headings = $derived.by(() => {
    if (!text || !Array.isArray(text.content)) {
      return [];
    }
    return [
      ...text.content
        .filter((node) => node.type === 'heading')
        .filter(isHeadingNode)
        .map((node, index) => ({
          label: node.content[0].text,
          level: node.attrs.level - 2,
          id: string.slugify(richTextJSONToText(node))
        }))
    ];
  });

  // Taken from https://github.com/huntabyte/bits-ui/blob/main/docs/src/lib/components/toc/toc.svelte
  function observerCallback(entries: IntersectionObserverEntry[]) {
    for (let entry of entries) {
      if (entry.isIntersecting) {
        visibleElements.add(entry.target);
      } else {
        visibleElements.delete(entry.target);
      }
    }
    const arrElements = Array.from(elements || []);
    let first = arrElements.find((element) => visibleElements.has(element));

    if (!first) return;
    activeIndex = arrElements.indexOf(first);
  }

  $effect(() => {
    const main = document.querySelector('main');
    if (!main) return;
    elements = main.querySelectorAll(
      '.render-rich-text > h2, .render-rich-text > h3'
    ) as NodeListOf<HTMLHeadingElement>;
  });

  // Intersection Observer to track visible headings
  $effect(() => {
    if (elements) {
      const observer = new IntersectionObserver(observerCallback, {
        rootMargin: '-70px 0px',
        threshold: 0
      });

      // Observe all elements with IDs from items
      elements.forEach((element) => observer.observe(element));

      return () => {
        observer.disconnect();
      };
    }
  });
</script>

<aside class="page-nav">
  <nav aria-label="On this page">
    <h2><TableOfContents size="14" /> On this page</h2>
    <ul>
      {#each headings as item, index (index)}
        <li>
          <a data-level={item.level} href="#{item.id}" class:active={activeIndex === index}>
            {item.label}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</aside>

<style lang="postcss">
  .page-nav {
    display: none;
    @media (min-width: 1280px) {
      display: block;
    }
  }

  h2 {
    @mixin font-title;
    font-size: var(--font-size-text-sm);
    margin-bottom: var(--size-4);
    display: flex;
    align-items: center;
    gap: var(--size-2);
  }
  nav {
    position: sticky;
    top: calc(var(--header-height) + var(--size-12));
    padding: 0 var(--size-12);
  }

  ul {
    margin-left: var(--size-4);
    display: grid;
  }
  a {
    font-size: var(--font-size-text-sm);
    display: block;
    color: oklch(var(--light-12) 0 0);
    text-decoration: none;
    border-left: 1px solid oklch(from var(--color-fg) l c h / 0.1);
    padding-top: var(--size-1);
    padding-bottom: var(--size-1);
    padding-left: var(--size-3);
    margin-left: calc(-1 * var(--size-3));
    transition: border-color 0.2s ease;
    &[data-level='1'] {
      padding-left: var(--size-6);
    }
  }

  a:hover {
    color: var(--color-fg);
  }

  a.active {
    color: var(--color-fg);
    border-left-color: var(--color-fg);
    font-weight: 500;
  }
</style>
