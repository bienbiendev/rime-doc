
<script>
	import { Panel } from 'rimecms/panel/client';
	import config from '$lib/+rime.generated/rime.config.js';
	
	const { children, data } = $props();
	
	const user = $derived.by(() => {
		if (!data.user) throw new Error('unauthorized');
		return data.user;
	});
</script>

<Panel {config} {user} routes={data.routes} locale={data.locale}>
	{@render children()}
</Panel>