import type { RichTextFeature, RichTextFeatureNode } from 'rimecms/types';
import { CircleAlert } from '@lucide/svelte';
import { mergeAttributes } from '@tiptap/core';
import Blockquote from '@tiptap/extension-blockquote';
import './warn-feature.css';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		warnBlock: {
			/**
			 * Set a blockquote node
			 */
			setWarnBlock: () => ReturnType;
			/**
			 * Toggle a blockquote node
			 */
			toggleWarnBlock: () => ReturnType;
			/**
			 * Unset a blockquote node
			 */
			unsetWarnBlock: () => ReturnType;
		};
	}
}

const WarnBlock = import.meta.env.SSR
	? undefined
	: Blockquote.extend({
			name: 'warnBlock',
			// @ts-expect-error https://github.com/ueberdosis/tiptap/issues/6670
			renderHTML({ HTMLAttributes }) {
				return ['blockquote', mergeAttributes(HTMLAttributes, { 'data-type': 'warn' }), 0];
			},
			addAttributes() {
				// @ts-expect-error https://github.com/ueberdosis/tiptap/issues/6670
				return { ...this.parent?.(), dataType: { default: 'warn' } };
			},
			addCommands() {
				return {
					setWarnBlock:
						() =>
						// @ts-expect-error https://github.com/ueberdosis/tiptap/issues/6670
						({ commands }) => {
							return commands.wrapIn(this.name);
						},
					toggleWarnBlock:
						() =>
						// @ts-expect-error https://github.com/ueberdosis/tiptap/issues/6670
						({ commands }) => {
							return commands.toggleWrap(this.name);
						},
					unsetWarnBlock:
						() =>
						// @ts-expect-error https://github.com/ueberdosis/tiptap/issues/6670
						({ commands }) => {
							return commands.lift(this.name);
						}
				};
			}
		});

const warnBlock: RichTextFeatureNode = {
	label: 'Warn block',
	icon: CircleAlert,
	suggestion: {
		command: ({ editor }) => editor.chain().focus().toggleWarnBlock().run()
	},
	nodeSelector: {
		command: ({ editor }) => editor.chain().focus().toggleWarnBlock().run()
	},
	isActive: ({ editor }) => editor.isActive('warnBlock')
};

export const warnBlockFeature: RichTextFeature = {
	extension: WarnBlock,
	nodes: [warnBlock]
};
