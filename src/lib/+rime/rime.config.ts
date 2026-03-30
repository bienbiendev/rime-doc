import { env } from '$env/dynamic/public';
import { rime } from '$rime/config';
import { adapterSqlite } from 'rimecms/sqlite';
import { medias } from './medias.js';
import { nav } from './nav.js';
import { pages } from './pages.js';

export default rime({
	$adapter: adapterSqlite('doc.sqlite'),
	collections: [pages, medias],
	areas: [nav],
	$cache: {
		isEnabled: () => true
	},
	siteUrl: env.PUBLIC_RIME_URL
});
