<script lang="ts">
	import { browser } from '$app/environment';
	import Header from '$lib/components/sections/header/Header.svelte';
	import Button from '$lib/components/ui/button/Button.svelte';
	import type { WithRelationPopulated } from 'rimecms/types';
	import Features from './Features.svelte';

	type Props = { doc: WithRelationPopulated<PagesDoc>; version: string | null };
	const { doc, version }: Props = $props();

	let scrollY = $state(0);
	let previewImgScale = $state(1);

	$effect(() => {
		if (browser) {
			initScroll();
		}
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function initScroll() {
		window.addEventListener('scroll', handleScroll);
	}

	function handleScroll() {
		requestAnimationFrame(onAnimationFrame);
	}

	function onAnimationFrame() {
		scrollY = window.scrollY;
		let scaleValue = 1 - (0.15 * scrollY) / window.innerHeight;
		previewImgScale = Math.min(Math.max(scaleValue, 0.93), 1);
	}
</script>

<svelte:head>
	<title>{doc.title} -</title>
</svelte:head>

<Header />

<section class="hero">
	<header>
		<div>
			<aside>
				<a class="hero__git" href="https://github.com/bienoubien-studio/rime" target="_blank">
					v{version}
					View on github
				</a>
			</aside>
			<h1>
				{@html doc.attributes.longTitle
					?.replace('\n', '<br/>')
					.replace('{', '<strong>')
					.replace('}', '</strong>')}
			</h1>
			<p>{doc.attributes.summary}</p>
			<div>
				<Button href="/docs/installation" size="lg">Get started</Button>
			</div>
		</div>
	</header>
	<img
		style="--scale:{previewImgScale}"
		class="hero__preview"
		src="/rime-preview.jpg"
		alt="preview of the admin panel"
	/>
</section>

<Features />

<style lang="postcss">
	:root {
		--section-gutter: 4vw;
		--section-space-y: var(--size-24);
	}

	.hero {
		margin-top: calc(-1 * var(--header-height));
		display: grid;
		place-content: center;
	}

	header {
		margin: var(--size-12) auto 0 auto;
		text-align: center;
		height: 70vh;
		max-width: 700px;
		> div {
			place-content: center;
			height: 100%;
			display: grid;
			gap: var(--size-6);
		}
	}
	img {
		clip-path: rect(6.6vw 95vw 59.25vw 5vw round 10px);
		transform: translateY(-15vh) scale(var(--scale, 1));
	}
	aside {
		font-size: var(--text-sm);
	}
	h1 {
		@mixin font-title;
		:global(strong) {
			@mixin font-brand;
		}
		font-size: var(--text-fluid-5xl);
	}
	p {
		opacity: 0.6;
		max-width: 600px;
		font-size: var(--text-lg);
	}
	.hero__git {
		border-radius: var(--size-6);
		padding: var(--size-1) var(--size-3);
		display: inline-block;
		border: 1px solid oklch(var(--light-10) 0 0);
		font-size: var(--text-xs);
		font-family: 'geist-mono';
	}
</style>
