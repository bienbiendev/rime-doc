<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import Button from '$lib/components/ui/button/Button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Moon, Sun } from '@lucide/svelte';
	import { mode, resetMode, setMode } from 'mode-watcher';

	type Props = { border?: boolean };
	const { border = false }: Props = $props();
</script>

<header class:header--border={border}>
	<div class="header__left">
		<a href="/">
			<Logo />
		</a>

		<!-- <Search /> -->

		<!-- <nav>
			<Button href="/docs/introduction" variant="link">docs</Button>
		</nav> -->
	</div>

	<div class="header__right">
		<Button
			size="icon-sm"
			variant="opacity"
			target="_blank"
			href="https://github.com/bienoubien-studio/rime"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
				><path
					fill="currentColor"
					d="M9.35 16.88c0 .07-.07.12-.17.12S9 17 9 16.88s.08-.12.17-.12s.18.05.18.12m-1-.15c0 .07 0 .15.14.17a.15.15 0 0 0 .2-.07c0-.07 0-.14-.14-.17s-.18 0-.2.07m1.42-.05c-.09 0-.15.08-.14.16s.09.11.19.09s.15-.09.14-.16s-.09-.1-.19-.09M11.9 4A7.83 7.83 0 0 0 4 12.07A8.29 8.29 0 0 0 9.47 20c.41.07.56-.19.56-.4v-2s-2.26.5-2.74-1c0 0-.36-1-.89-1.21c0 0-.74-.52.05-.51a1.67 1.67 0 0 1 1.24.85a1.69 1.69 0 0 0 2.36.69a1.83 1.83 0 0 1 .51-1.11c-1.8-.21-3.62-.47-3.62-3.66A2.54 2.54 0 0 1 7.7 9.7a3.2 3.2 0 0 1 .08-2.24c.68-.22 2.23.89 2.23.89a7.46 7.46 0 0 1 4.05 0s1.55-1.11 2.23-.89a3.14 3.14 0 0 1 .08 2.24a2.6 2.6 0 0 1 .83 1.95c0 3.2-1.9 3.45-3.7 3.66a2 2 0 0 1 .5 1.5v2.77a.42.42 0 0 0 .56.4A8.22 8.22 0 0 0 20 12.07A8 8 0 0 0 11.9 4M7.14 15.41v.17a.12.12 0 0 0 .17 0s0-.11 0-.18s-.13-.03-.17.01m-.35-.27s0 .1.07.13a.09.09 0 0 0 .14 0s0-.1-.07-.13s-.12-.03-.14 0m1 1.18v.21c0 .07.17.08.21 0s0-.14 0-.21s-.13-.05-.17 0Zm-.37-.49v.2c0 .08.14.11.19.08a.16.16 0 0 0 0-.21c-.05-.08-.13-.11-.19-.07"
				/></svg
			>
		</Button>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					{#if mode.current === 'light'}
						<Button {...props} size="icon" variant="ghost" icon={Sun}></Button>
					{:else}
						<Button {...props} size="icon" variant="ghost" icon={Moon}></Button>
					{/if}
				{/snippet}
				<span class="sr-only">Toggle theme</span>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Item onclick={() => setMode('light')}>Light</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setMode('dark')}>Dark</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => resetMode()}>System</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<div class="header__bg"></div>
</header>

<style>
	:root {
		--header-gutter: var(--size-7);
		--header-height: var(--size-16);
	}
	header {
		height: var(--header-height);
		z-index: 10;
		padding: 0 var(--header-gutter);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--size-8);
		position: sticky;
		top: 0;
	}
	.header--border {
		border-bottom: 1px solid var(--color-border);
		.header__bg {
			display: block;
		}
	}

	.header__bg {
		display: none;
		position: absolute;
		z-index: -1;
		inset: 0;
		--gradient: linear-gradient(
			to bottom,
			hsl(from var(--color-bg) h s l),
			/*hsl(from var(--color-bg) h s l) 50%,*/ hsl(from var(--color-bg) h s l / 0) 100%
		);
		background-image: var(--gradient);
		backdrop-filter: blur(6px);
	}

	.header__left {
		display: flex;
		@mixin font-brand;
		font-size: var(--text-3xl);
		align-items: center;
		gap: var(--size-8);
	}
	.header__right {
		display: flex;
		align-items: center;
		gap: var(--size-2);
	}
</style>
