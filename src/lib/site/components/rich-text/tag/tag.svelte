<script lang="ts">
	import { type RichTextNodeRendererProps } from 'rimecms/fields/rich-text';

	const { node, children }: RichTextNodeRendererProps = $props();
</script>

<span data-type={node.marks?.[0].type || null} {...node.attrs}>
	{@render children?.()}
</span>

<style>
	span {
		--color: oklch(from var(--color-fg) l c h / 0.3);
		position: relative;
		padding: var(--size-1) var(--size-2);
		font-size: 0.5em;
		border-radius: var(--size-1);
		border: 1px solid var(--color);
		font-variation-settings: 'wght' 400;
		display: inline-block;
		transform: translateY(-0.25em);
		margin-left: var(--size-2);
		color: var(--color);

		&[data-type='tag-warn'] {
			--color: var(--color-warn);
		}
	}
</style>
