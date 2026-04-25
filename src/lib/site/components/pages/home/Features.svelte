<script lang="ts">
  import Button from '$lib/site/components/ui/button/Button.svelte';
  import home from '$lib/site/content/home.js';
  import CardFeature from '../../ui/cards/CardFeature.svelte';
</script>

<section class="features">
  <header>
    <h2>Features</h2>
    <p>Rime comes with all the features a CMS need.</p>
  </header>
  <ul>
    {#each home.features as feature, index (index)}
      <li>
        <CardFeature {...feature} />
      </li>
    {/each}
  </ul>
  <div class="features__cta">
    <Button href="/docs/introduction">Read the doc</Button>
  </div>
</section>

<style lang="postcss">
  @import '../../../styles/mixins/index.css';

  h2 {
    text-align: center;
    font-size: var(--font-size-headline-xl);
    @mixin font-title;
  }

  p {
    text-align: center;
    font-size: var(--font-size-text-lg);
  }

  .features {
    border-top: 1px solid var(--color-border);
    display: grid;
    gap: var(--size-12);
    grid-template-columns: var(--section-gutter) 1fr var(--section-gutter);
    margin-block: var(--section-space-y);
    padding-inline: var(--page-gutter-lg);
  }

  header,
  ul,
  .features__cta {
    grid-column: -2 / 2;
  }

  header {
    gap: var(--size-4);
    display: grid;
  }
  ul {
    display: grid;
    gap: var(--size-4);
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  .features__cta {
    display: flex;
    justify-content: center;
  }
</style>
