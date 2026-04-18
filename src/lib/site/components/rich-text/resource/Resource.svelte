<script lang="ts">
	import CardResource from '$lib/site/components/ui/cards/CardResource.svelte';
	import type { RichTextNodeRendererProps } from 'rimecms/fields/rich-text';

	const { node }: RichTextNodeRendererProps = $props();
	const resource = $derived(node.resource);
</script>

{#if resource?.url}
	<CardResource
		link={resource.url}
		title={resource.attributes?.longTitle || node.attrs?.title}
		description={resource.attributes?.summary}
	/>
{/if}
