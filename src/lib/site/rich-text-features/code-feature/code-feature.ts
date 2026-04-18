import type {
	RichTextFeature,
	RichTextFeatureMark,
	RichTextFeatureNode
} from 'rimecms/types';
import { Code as Icon } from '@lucide/svelte';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import './code-feature.css';

const codeBlock: RichTextFeatureNode = {
	label: 'Code block',
	icon: Icon,
	suggestion: {
		command: ({ editor }) => editor.chain().focus().toggleCodeBlock().run()
	},
	nodeSelector: {
		command: ({ editor }) => editor.chain().focus().toggleCodeBlock().run()
	},
	isActive: ({ editor }) => editor.isActive('codeBlock')
};

export const codeBlockFeature: RichTextFeature = {
	extension: !import.meta.env.SSR ? CodeBlock : undefined,
	nodes: [codeBlock]
};

const codeMark: RichTextFeatureMark = {
	label: 'Code',
	icon: Icon,
	bubbleMenu: {
		command: ({ editor }) => editor.chain().focus().toggleCode().run()
	},
	isActive: ({ editor }) => editor.isActive('code')
};

export const codeFeature: RichTextFeature = {
	extension: !import.meta.env.SSR ? Code : undefined,
	marks: [codeMark]
};
