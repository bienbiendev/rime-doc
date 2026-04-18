<script lang="ts">
  import type { RichTextNodeRendererProps } from 'rimecms/fields/rich-text';

  const { node, children }: RichTextNodeRendererProps = $props();
</script>

<td {...node.attrs}>
  {@render children?.()}
</td>

<style>
  td {
    font-size: var(--font-size-text-sm);
    padding: var(--size-1);
    padding-left: var(--size-1);
  }
  td:first-child {
    font-size: var(--font-size-text-xs);
    font-family: 'geist-mono';
  }
</style>
