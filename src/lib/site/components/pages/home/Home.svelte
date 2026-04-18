<script lang="ts">
  import { browser } from '$app/environment';
  import Header from '$lib/site/components/sections/header/Header.svelte';
  import Button from '$lib/site/components/ui/button/Button.svelte';
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
    let scaleValue = 1 - (0.05 * scrollY) / window.innerHeight;
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
        <a class="hero__git" href="https://github.com/bienbiendev/rime" target="_blank">
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
    --section-space-y: var(--size-24);
  }

  .hero {
    padding-inline: var(--page-gutter);
    margin-top: calc(-1 * var(--header-height));
    display: grid;
    place-content: center;
  }

  header {
    /* margin: var(--size-12) auto 0 auto; */
    /* text-align: center; */
    height: 88vh;
    max-width: 700px;
    padding-inline: 5vw;
    > div {
      place-content: end left;
      height: 100%;
      display: grid;
      gap: var(--size-6);
    }
  }
  img {
    clip-path: rect(6.6vw 95vw 59.25vw 5vw round 10px);
    transform: translateY(-5vh) scale(var(--scale, 1));
  }
  aside {
    font-size: var(--font-size-text-sm);
  }
  h1 {
    @mixin font-title;
    font-size: var(--font-size-headline-2xl);
  }
  p {
    opacity: 0.6;
    max-width: 500px;
    font-size: var(--font-size-text-xs);
  }
  .hero__git {
    border-radius: var(--size-6);
    padding: var(--size-1) var(--size-3);
    display: inline-block;
    border: 1px solid oklch(var(--light-10) 0 0);
    font-size: var(--font-size-text-2xs);
    font-family: 'geist-mono';
  }
</style>
