import { Info } from '@lucide/svelte';
import { mergeAttributes } from '@tiptap/core';
import Blockquote from '@tiptap/extension-blockquote';
import type { RichTextFeature, RichTextFeatureNode } from 'rimecms/types';
import './info-feature.css';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		infoBlock: {
			/**
			 * Set a blockquote node
			 */
			setInfoBlock: () => ReturnType;
			/**
			 * Toggle a blockquote node
			 */
			toggleInfoBlock: () => ReturnType;
			/**
			 * Unset a blockquote node
			 */
			unsetInfoBlock: () => ReturnType;
		};
	}
}

const InfoBlock = import.meta.env.SSR
	? undefined
	: Blockquote.extend({
			name: 'infoBlock',
			renderHTML({ HTMLAttributes }) {
				return ['blockquote', mergeAttributes(HTMLAttributes, { 'data-type': 'info' }), 0];
			},
			addAttributes() {
				return { ...this.parent?.(), dataType: { default: 'info' } };
			},
			addCommands() {
				return {
					setInfoBlock:
						() =>
						({ commands }) => {
							return commands.setMark(this.name);
						},
					toggleInfoBlock:
						() =>
						({ commands }) => {
							return commands.toggleWrap(this.name);
						},
					unsetInfoBlock:
						() =>
						({ commands }) => {
							return commands.lift(this.name);
						}
				};
			}
		});

const infoBlock: RichTextFeatureNode = {
	label: 'Info block',
	icon: Info,
	suggestion: {
		command: ({ editor }) => editor.chain().focus().toggleInfoBlock().run()
	},
	nodeSelector: {
		command: ({ editor }) => editor.chain().focus().toggleInfoBlock().run()
	},
	isActive: ({ editor }) => editor.isActive('infoBlock')
};

export const infoBlockFeature: RichTextFeature = {
	extension: InfoBlock,
	nodes: [infoBlock]
};
