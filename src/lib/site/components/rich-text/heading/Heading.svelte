<script lang="ts">
  import {
    RenderRichText,
    richTextJSONToText,
    type RichTextNodeRendererProps
  } from 'rimecms/fields/rich-text';
  import { string } from 'rimecms/util';
  import './heading.css';

  const { node, components }: RichTextNodeRendererProps = $props();

  const element = $derived(`h${node.attrs?.level || 2}`);
  const id = $derived(string.slugify(richTextJSONToText(node)));
  const hasAnchor = $derived(['h2', 'h3'].includes(element));
</script>

<svelte:element this={element} {...node.attrs} {id} data-anchor={hasAnchor ? '' : null}>
  <RenderRichText {components} json={node} />
</svelte:element>
