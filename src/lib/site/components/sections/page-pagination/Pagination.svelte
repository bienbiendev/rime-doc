<script lang="ts">
	import CardPagination from '$lib/site/components/ui/cards/CardPagination.svelte';

	const { pagination }: { pagination: Pagination } = $props();
</script>

<aside class="pagination">
	<div class="pagination__prev">
		{#if pagination.prev}
			<CardPagination
				align="left"
				uptitle="Previous page"
				title={pagination.prev.title}
				link={pagination.prev.url}
			/>
		{/if}
	</div>

	<div class="pagination__next">
		{#if pagination.next}
			<CardPagination
				align="right"
				uptitle="Next page"
				title={pagination.next.title}
				link={pagination.next.url}
			/>
		{/if}
	</div>
</aside>

<style>
	.pagination {
		display: flex;
		width: 100%;
		justify-content: space-between;
		margin-top: var(--size-12);
		gap: var(--size-4);
		> * {
			flex-grow: 0;
			flex-shrink: none;
		}
	}
	.pagination__prev {
		display: none;
		@media (min-width: 1024px) {
			display: block;
		}
	}
</style>
