<script lang="ts">
  import ButtonCopy from '$lib/site/components/ui/button-copy/ButtonCopy.svelte';
  import { highlightCode } from '$lib/site/rich-text-features/code-feature/highlighter/highlighter.js';

  type Props = { node: any };
  const { node }: Props = $props();

  const [file, code] = $derived.by(() => {
    if (!Array.isArray(node.content)) return [null, null];

    const raw = node.content[0]?.text || '';

    const lines = raw.split('\n');
    if (lines.length === 0) return [null, null];

    const firstLine = lines[0].trim();

    // Check for comment patterns
    if (firstLine.startsWith('# @file:')) {
      const comment = firstLine.slice(9).trim();
      const remainingCode = lines.slice(1).join('\n').trim();
      return [comment, remainingCode];
    }

    if (firstLine.startsWith('// @file:')) {
      const comment = firstLine.slice(9).trim();
      const remainingCode = lines.slice(1).join('\n').trim();
      return [comment, remainingCode];
    }

    if (firstLine.startsWith('/** @file:') && firstLine.endsWith(' */')) {
      const comment = firstLine.slice(10, -3).trim();
      const remainingCode = lines.slice(1).join('\n').trim();
      return [comment, remainingCode];
    }

    // No comment found, return null for file and full content as code
    return [null, raw];
  });
</script>

<div class="code-block">
  {#if code}
    {#if file}
      <header>{file}</header>
    {/if}

    <div class="code-box">
      <ButtonCopy text={code} />
      {@html highlightCode(code, node.attrs.language)}
    </div>
  {/if}
</div>

<style>
  :root {
    --code-bg: color-mix(in oklch, var(--color-bg) 98%, black);
  }

  :global {
    [data-theme='dark'] {
      --code-bg: color-mix(in oklch, var(--color-bg) 92%, white);
    }
  }

  .code-block {
    font-family: 'geist-mono';
    border: 1px solid var(--color-border);
    border-radius: var(--size-1);
    background-color: var(--code-bg);
    margin-block: var(--size-4);
    /*margin-bottom: var(--size-2);*/
    position: relative;

    header {
      border-bottom: 1px solid var(--color-bg);
      padding: var(--size-3);
      font-size: var(--font-size-text-xs);
      color: oklch(var(--light-11) 0 0);
    }

    .code-box {
      max-width: 100%;
      overflow-x: auto;
      font-size: var(--font-size-text-xs);
      padding: var(--size-4) var(--size-3);
      display: block;
    }

    :global {
      .button-copy {
        position: absolute;
        right: var(--size-2);
        top: var(--size-2);
      }
    }
  }
</style>
