
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Dictionaries } from 'rimecms/i18n';
	import i18n from 'rimecms/i18n';
	import 'rimecms/panel/style/index.css';

	type Props = { children: Snippet; data: { translations: Dictionaries } };

	const { children, data }: Props = $props();
	
	// svelte-ignore state_referenced_locally
	i18n.init(data.translations);
</script>

<div class="rz-root">
	{@render children()}
</div>