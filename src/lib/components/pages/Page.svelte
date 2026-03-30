<script lang="ts">
	import Blockquote from '$lib/components/rich-text/blockquote/Blockquote.svelte';
	import CodeBlock from '$lib/components/rich-text/code-block/CodeBlock.svelte';
	import Code from '$lib/components/rich-text/code/Code.svelte';
	import Heading from '$lib/components/rich-text/heading/Heading.svelte';
	import Resource from '$lib/components/rich-text/resource/Resource.svelte';
	import Table from '$lib/components/rich-text/table/Table.svelte';
	import TableCell from '$lib/components/rich-text/table/TableCell.svelte';
	import TableHeader from '$lib/components/rich-text/table/TableHeader.svelte';
	import TableRow from '$lib/components/rich-text/table/TableRow.svelte';
	import Tag from '$lib/components/rich-text/tag/tag.svelte';
	import Header from '$lib/components/sections/header/Header.svelte';
	import Nav from '$lib/components/sections/nav/Nav.svelte';
	import PageNav from '$lib/components/sections/page-nav/PageNav.svelte';
	import PagePagination from '$lib/components/sections/page-pagination/Pagination.svelte';
	import { RenderRichText } from 'rimecms/fields/rich-text';
	import type { WithRelationPopulated } from 'rimecms/types';
	import { string } from 'rimecms/util';

	type Props = { doc: WithRelationPopulated<PagesDoc>; pagination: Pagination; nav: NavDoc };

	const { doc, pagination, nav }: Props = $props();
</script>

<svelte:head>
	<title>{doc.title} -</title>
</svelte:head>

<Header border={true} />

<div class="page">
	<Nav {nav} />

	<div class="page__center">
		<main>
			<h1 id={string.slugify(doc.title)}>{doc.attributes.longTitle || doc.title}</h1>

			<div class="render-rich-text">
				<RenderRichText
					json={doc.content.text}
					components={{
						resource: Resource,
						codeBlock: CodeBlock,
						heading: Heading,
						code: Code,
						warnBlock: Blockquote,
						infoBlock: Blockquote,
						tag: Tag,
						'tag-warn': Tag,
						table: Table,
						tableRow: TableRow,
						tableCell: TableCell,
						tableHeader: TableHeader
					}}
				/>
			</div>

			<PagePagination {pagination} />
		</main>
	</div>

	{#key doc.id}
		<PageNav pageTitle={doc.title} text={doc.content.text} />
	{/key}
	<!-- <Font /> -->
</div>

<style lang="postcss">
	h1 {
		@mixin font-title;
		font-size: var(--text-fluid-3xl);
		scroll-margin-top: calc(var(--size-16) + var(--header-height));
	}
	.page {
		display: grid;
		grid-template-columns: var(--header-gutter) minmax(0, 1fr) var(--header-gutter);
		max-width: 1920px;
		width: 100vw;

		@media (min-width: 768px) {
			grid-template-columns: 280px minmax(0, 1fr) var(--size-4);
		}
		@media (min-width: 1280px) {
			grid-template-columns: 320px minmax(0, 1fr) 320px;
		}
	}
	.page__center {
		container-type: inline-size;
		grid-column: 2 / -2;
	}

	main {
		margin-top: var(--size-12);
		margin-bottom: var(--size-12);
		@container (min-width:800px) {
			max-width: 800px;
			margin-left: auto;
			margin-right: auto;
		}
	}

	.render-rich-text {
		width: 100%;
		margin-top: var(--size-8);
	}
</style>
