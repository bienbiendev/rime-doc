import type { ThemeState } from '$lib/site/theme.svelte';
import { error, type ServerLoadEvent } from '@sveltejs/kit';

export const load = async ({ locals, fetch, cookies }: ServerLoadEvent) => {
  const { rime } = locals;

  console.time('layout');
  async function getPackageVersion(packageName: string) {
    try {
      const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
      const data = await response.json();
      return data.version as string;
    } catch (error) {
      console.error('Failed to fetch package version:', error);
      return null;
    }
  }

  const nav = await rime.area('nav').find({ depth: 1 });
  const version = await rime.cache.get('package', () => getPackageVersion('rimecms'));
  console.timeEnd('layout');

  if (!nav) {
    return error(404);
  }

  const theme: ThemeState = {
    value: (cookies.get('theme.value') || 'light') as ThemeState['value'],
    mode: (cookies.get('theme.mode') || 'light') as ThemeState['mode']
  };

  locals.theme = theme;

  return { nav, version, theme };
};
