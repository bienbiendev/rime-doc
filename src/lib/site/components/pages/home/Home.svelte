<script lang="ts">
  import Header from '$lib/site/components/sections/header/Header.svelte';
  import Button from '$lib/site/components/ui/button/Button.svelte';

  import { getThemeContext } from '$lib/site/theme.svelte';
  import type { WithRelationPopulated } from 'rimecms/types';
  import Features from './Features.svelte';

  type Props = { doc: WithRelationPopulated<PagesDoc>; version: string | null };
  const { doc, version }: Props = $props();

  const theme = getThemeContext();
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
        {@html doc.attributes.longTitle?.replace('\n', '<br/>')}
      </h1>
      <p>{doc.attributes.summary}</p>
      <div>
        <Button href="/docs/installation" size="lg">Get started</Button>
      </div>
    </div>
  </header>

  <div class="hero__preview">
    <img src="/rime-preview-collection-{theme.value}.jpg" alt="preview of the admin panel" />
  </div>
</section>

<!-- {#snippet feature(node: JSONContent)}
  {console.log(node)}
{/snippet} -->

<!-- <RenderRichText
  json={doc.content.text}
  components={{
    resource: feature
  }}
/> -->

<Features />

<style lang="postcss">
  :root {
    --section-space-y: var(--size-24);
  }

  .hero {
    margin-top: calc(-1 * var(--header-height));
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    place-content: center;
    overflow: hidden;
  }

  header {
    height: 88vh;
    max-width: 700px;
    grid-column: span 1;
    padding-left: var(--page-gutter-lg);
    > div {
      place-content: center;
      height: 100%;
      display: grid;
      gap: var(--size-6);
    }
  }

  .hero__preview {
    border: 3px solid var(--color-border);
    overflow: hidden;
    transform: translateX(9px);
    margin-top: var(--size-24);
    border-radius: var(--size-3);
    img {
      width: auto;
      height: 100%;
      display: block;
      object-fit: cover;
      object-position: left top;
    }
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
    font-family: var(--font-mono);
  }
  .hero__git {
    border-radius: var(--size-0-5);
    padding: var(--size-1) var(--size-3);
    display: inline-block;
    text-transform: uppercase;
    border: 1px solid oklch(var(--light-10) 0 0);
    font-size: var(--font-size-text-2xs);
    font-family: 'geist-mono';
  }
</style>
