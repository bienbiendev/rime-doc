<script lang="ts">
	import Home from '$lib/components/pages/home/Home.svelte';
	import Page from '$lib/components/pages/Page.svelte';
	import type { PageData } from './$types';

	type Props = { data: PageData };
	const { data }: Props = $props();
</script>

{#if data.doc.attributes.isHome}
	<Home version={data.version} doc={data.doc} />
{:else}
	<Page doc={data.doc} nav={data.nav} pagination={data.pagination} />
{/if}
