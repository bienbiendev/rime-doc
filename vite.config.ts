import { sveltekit } from '@sveltejs/kit/vite';
import { rime } from 'rimecms/vite';
import { defineConfig } from 'vite';

const dev = process.env.NODE_ENV === 'development';

export default defineConfig({
	plugins: [rime(), sveltekit()],
	server: {
		allowedHosts: dev ? ['http://localhost'] : undefined
	}
});
