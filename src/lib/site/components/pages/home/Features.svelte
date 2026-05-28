<script lang="ts">
  import { getThemeContext } from '$lib/site/theme.svelte';
  import { isRelationPopulated } from 'rimecms/fields/relation';
  const { features }: { features: FeaturesDoc[] } = $props();

  const theme = getThemeContext();
</script>

<div class="features">
  <ul>
    {#each features as feature, index (index)}
      {@const previewLight = feature.previews.light}
      {@const previewDark = feature.previews.dark}
      {@const previews = { light: previewLight, dark: previewDark }}
      <li class="feature">
        <div class="feature__content">
          <p class="feature__uptitle">{feature.scope}</p>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
        {#if previewLight && previewDark && isRelationPopulated(previewLight) && isRelationPopulated(previewDark)}
          <div
            class="feature__preview"
            style="background-image: url({previews[theme.value]?.[0]?.url});"
          ></div>
        {/if}
      </li>
    {/each}
  </ul>
</div>

<style>
  .features {
    display: flex;
    flex-direction: column;
  }

  h3 {
    font-size: var(--font-size-headline-sm);
    margin-bottom: var(--size-2);
  }

  .feature__uptitle {
    text-transform: uppercase;
    font-size: var(--font-size-headline-eyebrow);
    font-family: var(--font-mono);
    letter-spacing: 0.05em;
    opacity: 0.5;
    margin-bottom: var(--size-2);
  }

  li {
    margin-top: 1px solid var(--color-border);
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    min-height: 30vw;
    background-color: var(--color-bg);
    border-top: 1px solid var(--color-border);

    .feature__content {
      padding: var(--size-12) var(--page-gutter-lg);
    }
    .feature__preview {
      position: sticky;
      top: 0;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: top left;
      /* background-attachment: fixed; */
    }
  }
</style>
