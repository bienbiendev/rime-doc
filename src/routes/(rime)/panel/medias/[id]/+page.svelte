
<script lang="ts">
	import { CollectionDoc, type CollectionDocData } from 'rimecms/panel/client';
	const { data }: { data: CollectionDocData<false> } = $props();
</script>

<CollectionDoc {data} />