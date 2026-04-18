import { ShieldQuestion } from '@lucide/svelte';
import { Mark, mergeAttributes } from '@tiptap/core';
import type { RichTextFeature, RichTextFeatureMark } from 'rimecms/types';
import './tag-feature.css';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		tag: {
			/**
			 * Set a blockquote node
			 */
			setTag: () => ReturnType;
			/**
			 * Toggle a blockquote node
			 */
			toggleTag: () => ReturnType;
			/**
			 * Unset a blockquote node
			 */
			unsetTag: () => ReturnType;
		};
	}
}

const Tag = Mark.create({
	name: 'tag',
	addOptions() {
		return {
			HTMLAttributes: {}
		};
	},
	renderHTML({ HTMLAttributes }) {
		return ['span', mergeAttributes(HTMLAttributes, { class: 'tag-mark' }), 0];
	},
	addCommands() {
		return {
			setTag:
				() =>
				({ commands }) => {
					return commands.wrapIn(this.name);
				},
			toggleTag:
				() =>
				({ commands }) => {
					return commands.toggleMark(this.name);
				},
			unsetTag:
				() =>
				({ commands }) => {
					return commands.unsetMark(this.name);
				}
		};
	}
});

const tagMark: RichTextFeatureMark = {
	label: 'Tag',
	icon: ShieldQuestion,
	bubbleMenu: {
		command: ({ editor }) => {
			editor.chain().focus().toggleTag().run();
		}
	},
	isActive: ({ editor }) => editor.isActive('tag')
};

export const tagMarkFeature: RichTextFeature = {
	extension: Tag,
	nodes: [tagMark]
};
