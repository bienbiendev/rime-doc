import { env } from '$env/dynamic/public';
import { error, redirect, type ServerLoadEvent } from '@sveltejs/kit';
import type { Link } from 'rimecms/types';

export const load = async ({ locals, params, parent, url }: ServerLoadEvent) => {
  const { rime } = locals;
  const { parts } = params;

  console.time('page');

  if (parts === 'docs') throw redirect(301, '/docs/introduction');
  const isHome = !parts;

  // Get page depending on it is home or not
  const query = !isHome
    ? `where[url][equals]=${env.PUBLIC_RIME_URL}/${parts}`
    : `where[attributes.isHome][equals]=true`;

  const docs = await rime.collection('pages').find({
    query
  });

  // Get pagination
  const layoutProps = await parent();

  /**
   * Function to get previous and next pages
   * with relative informations : title, description, url
   */
  async function getPagination(nav: NavDoc['main']) {
    // function to flatten the nav and ignoring top levels group
    const flattenLinks = (acc: Link[], curr: TreeMain): Link[] => {
      if (curr.pages && curr.pages.url && curr.label) {
        acc.push(curr.pages);
      }
      if (curr._children.length) {
        acc = [...acc, ...curr._children.reduce(flattenLinks, [])];
      }
      return acc;
    };

    // Flatten nav
    const flatLinks = nav.reduce(flattenLinks, []);

    // Get current, next, and previous link
    const currentUrl = `${env.PUBLIC_RIME_URL}${url.pathname}`;
    const currentIndex = flatLinks.findIndex((link) => link.url === currentUrl);
    const nextIndex = currentIndex + 1 === flatLinks.length ? null : currentIndex + 1;
    const prevIndex = currentIndex === 0 ? null : currentIndex - 1;
    const nextLink = nextIndex ? flatLinks[nextIndex] : null;
    const prevLink = prevIndex !== null ? flatLinks[prevIndex] : null;

    // Given a link retrieve page data
    async function getPage(link: Link | null) {
      if (!link || !link.value) return null;
      // Get page
      const [page] = await rime.collection('pages').find({
        select: ['attributes.title', 'attributes.longTitle', 'attributes.summary', 'url'],
        query: `where[id][equals]=${link.value}`
      });
      // Populate data and returns
      if (page && page.url) {
        return {
          title: page.attributes.longTitle || page.attributes.title || '',
          description: page.attributes.summary || '',
          url: page.url
        };
      }
      return null;
    }
    return { prev: await getPage(prevLink), next: await getPage(nextLink) };
  }

  const pagination = isHome
    ? { prev: null, next: null }
    : await getPagination(layoutProps.nav.main);

  const features = isHome ? await rime.collection('features').find({ depth: 1 }) : [];

  if (!docs.length) {
    return error(404);
  }

  console.timeEnd('page');

  return { doc: docs[0], pagination, features };
};
