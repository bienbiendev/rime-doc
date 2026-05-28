<script lang="ts">
  import CardResource from '$lib/site/components/ui/cards/CardResource.svelte';
  import type { RichTextNodeRendererProps } from 'rimecms/fields/rich-text';

  const { node }: RichTextNodeRendererProps = $props();
  const resource = $derived(node.resource);
</script>

{#if resource?.url}
  <CardResource
    link={resource.url}
    title={node.attrs?.title || resource.attributes?.longTitle || resource.attributes?.title}
    description={resource.attributes?.summary}
  />
{/if}
