<script lang="ts">
  import type { RichTextNodeRendererProps } from 'rimecms/fields/rich-text';

  const { node, children }: RichTextNodeRendererProps = $props();
</script>

<th {...node.attrs}>
  {@render children?.()}
</th>

<style>
  th {
    text-align: left;
    font-variation-settings: 'wght' 500;
    font-size: var(--font-size-text-sm);
    opacity: 0.3;
  }
</style>
