import { Collection } from '$rime/config';
import { text } from 'rimecms/fields';

export const medias = Collection.create('medias', {
	upload: true,
	panel: {
		group: 'content'
	},
	access: {
		read: () => true
	},
	fields: [text('alt').required()]
});
