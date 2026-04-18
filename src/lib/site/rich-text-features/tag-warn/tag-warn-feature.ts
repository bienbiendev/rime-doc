import type { RichTextFeature, RichTextFeatureMark } from 'rimecms/types';
import { ShieldAlert } from '@lucide/svelte';
import { Mark, mergeAttributes } from '@tiptap/core';
import './tag-warn-feature.css';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		tagWarn: {
			/**
			 * Set a blockquote node
			 */
			setTagWarn: () => ReturnType;
			/**
			 * Toggle a blockquote node
			 */
			toggleTagWarn: () => ReturnType;
			/**
			 * Unset a blockquote node
			 */
			unsetTagWarn: () => ReturnType;
		};
	}
}

const Tag = Mark.create({
	name: 'tag-warn',
	addOptions() {
		return {
			HTMLAttributes: {}
		};
	},
	renderHTML({ HTMLAttributes }) {
		return ['span', mergeAttributes(HTMLAttributes, { class: 'tag-warn-mark' }), 0];
	},
	addCommands() {
		return {
			setTagWarn:
				() =>
				({ commands }) => {
					return commands.wrapIn(this.name);
				},
			toggleTagWarn:
				() =>
				({ commands }) => {
					return commands.toggleMark(this.name);
				},
			unsetTagWarn:
				() =>
				({ commands }) => {
					return commands.unsetMark(this.name);
				}
		};
	}
});

const tagWarnMark: RichTextFeatureMark = {
	label: 'Tag Warn',
	icon: ShieldAlert,
	bubbleMenu: {
		command: ({ editor }) => {
			editor.chain().focus().toggleTagWarn().run();
		}
	},
	isActive: ({ editor }) => editor.isActive('tag-warn')
};

export const tagWarnMarkFeature: RichTextFeature = {
	extension: Tag,
	nodes: [tagWarnMark]
};
