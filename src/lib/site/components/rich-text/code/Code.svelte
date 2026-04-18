<script lang="ts">
  import type { RichTextNodeRendererProps } from 'rimecms/fields/rich-text';

  const { node }: RichTextNodeRendererProps = $props();
</script>

<span class="code-mark">
  {#if node.text}
    {node.text}
  {/if}
</span>

<style>
  .code-mark {
    font-family: 'geist-mono';
    background-color: oklch(from var(--color-fg) calc(l * 8) calc(c * 1.5) h / 0.2);
    padding-left: var(--size-1);
    padding-right: var(--size-1);
    border-radius: var(--size-1);
    font-size: var(--font-size-text-sm);
  }
</style>
