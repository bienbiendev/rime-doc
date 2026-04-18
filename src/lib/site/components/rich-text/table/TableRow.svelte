<script lang="ts">
	import type { RichTextNodeRendererProps } from 'rimecms/fields/rich-text';

	const { node, children }: RichTextNodeRendererProps = $props();
</script>

<tr style="--cell-count:{node.content?.length || 0}" {...node.attrs}>
	{@render children?.()}
</tr>

<style>
	tr {
		display: block grid;
		grid-template-columns: 1fr repeat(calc(var(--cell-count) - 1), 3.5fr);
	}

	tr {
		padding: var(--size-2);
	}

	tr:not(:first-child) {
		min-height: var(--size-12);
	}

	tr:nth-child(2n) {
		background-color: oklch(from var(--color-fg) l c h / 0.04);
	}
</style>
