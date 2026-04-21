<script lang="ts">
  import '$lib/site/styles/index.css';
  import { setThemeContext } from '$lib/site/theme.svelte.js';

  const { children, data } = $props();

  setThemeContext(data.theme);
</script>

<div>{@render children()}</div>
