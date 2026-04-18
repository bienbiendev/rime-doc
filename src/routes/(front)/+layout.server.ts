import { error, type ServerLoadEvent } from '@sveltejs/kit';

export const load = async ({ locals, fetch }: ServerLoadEvent) => {
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

  return { nav, version };
};
