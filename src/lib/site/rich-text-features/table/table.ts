import type { RichTextFeature } from 'rimecms/types';
import { Info } from '@lucide/svelte';
import { TableKit } from '@tiptap/extension-table';
import './table.css';

export const tableFeature: RichTextFeature = {
	extension: !import.meta.env.SSR ? TableKit : undefined,
	nodes: [
		{
			label: 'Insert table',
			icon: Info,
			suggestion: {
				command: ({ editor }) =>
					editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
			}
		},
		{
			label: 'Delete table',
			icon: Info,
			suggestion: {
				command: ({ editor }) => editor.chain().focus().deleteTable().run()
			}
		},
		{
			label: 'Add Column',
			icon: Info,
			suggestion: {
				command: ({ editor }) => editor.chain().focus().addColumnAfter().run()
			}
		},
		{
			label: 'Delete Column',
			icon: Info,
			suggestion: {
				command: ({ editor }) => editor.chain().focus().deleteColumn().run()
			}
		},
		{
			label: 'Add Row',
			icon: Info,
			suggestion: {
				command: ({ editor }) => editor.chain().focus().addRowAfter().run()
			}
		},
		{
			label: 'Delete Row',
			icon: Info,
			suggestion: {
				command: ({ editor }) => editor.chain().focus().deleteRow().run()
			}
		}
	]
};
