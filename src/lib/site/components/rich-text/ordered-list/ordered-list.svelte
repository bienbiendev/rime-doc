<script lang="ts">
  import { RenderRichText, type RichTextNodeRendererProps } from 'rimecms/fields/rich-text';

  const { node, components, children }: RichTextNodeRendererProps = $props();

  // const { ...restAttrs } = node.attrs as { dataType: string } & Record<string, any>;
</script>

<ol>
  {#each node.content || [] as child, index}
    <li data-index={index + (node.attrs?.start || 1)}>
      <RenderRichText {components} json={child} />
    </li>
  {/each}
</ol>
