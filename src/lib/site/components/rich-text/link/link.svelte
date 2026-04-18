<script lang="ts">
  import type { RichTextNodeRendererProps } from 'rimecms/fields/rich-text';

  const { node, children }: RichTextNodeRendererProps = $props();

  const href = $derived.by(() => {
    if (node.marks && node.marks.length && node.marks[0].attrs?.href) {
      return node.marks[0].attrs.href;
    }
    return null;
  });
</script>

{#if href}
  <a {href}>{@render children?.()}</a>
{/if}
