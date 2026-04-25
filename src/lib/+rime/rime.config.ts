import { env } from '$env/dynamic/public';
import { rime } from '$rime/config';
import { json } from '@sveltejs/kit';
import { adapterSqlite } from 'rimecms/sqlite';
import { features } from './features.js';
import { medias } from './medias.js';
import { nav } from './nav.js';
import { pages } from './pages.js';

export default rime({
  $adapter: adapterSqlite('doc.sqlite'),
  collections: [pages, medias, features],
  areas: [nav],
  $cache: {
    isEnabled: () => true
  },
  siteUrl: env.PUBLIC_RIME_URL,
  $smtp: {
    from: process.env.RIME_SMTP_USER,
    host: process.env.RIME_SMTP_HOST,
    port: parseInt(process.env.RIME_SMTP_PORT || '465'),
    auth: {
      user: process.env.RIME_SMTP_USER,
      password: process.env.RIME_SMTP_PASSWORD
    }
  },
  $routes: {
    '/api/search.json': {
      GET: async ({ locals }) => {
        const pages = await locals.rime.collection('pages').find({
          select: [
            'attributes.longTitle',
            'content.text',
            'url',
            'attributes.categories',
            'attributes.summary'
          ],
          query: 'where[attributes.isHome][equals]=0'
        });
        return json(pages);
      }
    }
  }
});
