<script>
	import { dev } from '$app/environment';
	import { Check, Copy } from '@lucide/svelte';
	import Button from '../button/Button.svelte';

	const { text } = $props();

	let copied = $state(false);

	function copy() {
		if (!navigator.clipboard) {
			if (dev) copied = true;
			return;
		}
		navigator.clipboard.writeText(text);
		copied = true;
	}
</script>

<Button
	--color-fg={!copied ? 'var(--color-fg)' : 'var(--color-primary)'}
	class="button-copy"
	onclick={copy}
	size="icon-sm"
	icon={copied ? Check : Copy}
	variant="secondary"
/>
