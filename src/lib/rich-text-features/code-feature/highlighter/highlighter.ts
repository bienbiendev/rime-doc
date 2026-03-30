import { createCssVariablesTheme, createHighlighter } from 'shiki';
import './highlight.css';

export const THEME = 'rime';

const rimeTheme = createCssVariablesTheme({
	name: 'rime-variable',
	variablePrefix: '--shiki-',
	variableDefaults: {},
	fontStyle: true
});

export const highlighter = await createHighlighter({
	themes: [rimeTheme],
	langs: ['typescript', 'bash', 'svelte']
});

export function highlightCode(code: string, lang: string) {
	return highlighter.codeToHtml(code, {
		lang: lang,
		theme: 'rime-variable'
	});
}
