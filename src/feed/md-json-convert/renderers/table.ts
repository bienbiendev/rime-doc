/**
 * Table node renderer
 */

import { parseMarkdown, type ParseMarkdownFn, type ParseResult } from '..';

export const tableRenderer = {
	type: 'node',
	matcher: /^\s*\|(.+)\|\s*\n\s*\|[-—\s|]*\|\s*\n((?:\s*\|.+\|\s*\n?)+)/m,

	/**
	 * Checks if markdown text contains bold formatting
	 */
	match(input: string) {
		return input.match(this.matcher);
	},

	/**
	 * Converts table match to JSON mark
	 */
	async renderJSON(
		input: string,
		params: {
			renderers: any[];
			parseMarkdown: ParseMarkdownFn;
		}
	): Promise<ParseResult | null> {
		const group = input.match(this.matcher);
		if (!group) return null;

		const [whole, matchHead, matchRows] = group;

		function splitTableLine(line: string) {
			return line
				.split(/(?<!\\)\|/)
				.map((cell) => cell.trim().replace(/\\\|/g, '|'))
				.filter((cell) => cell);
		}

		// filter out empty strings and trim each part
		const head = splitTableLine(matchHead);
		// split by newlines first, then process each row
		const rows = matchRows.trim().split('\n');

		const tableRows: any[] = [];

		enum CellType {
			tableHeader = 'tableHeader',
			tableCell = 'tableCell'
		}

		async function buildCell(text: string, type: CellType) {
			return {
				type,
				attrs: {
					colspan: 1,
					colwidth: null,
					rowspan: 1
				},
				content: await parseMarkdown(text, params.renderers)
			};
		}

		const headRowContent: any[] = [];
		for (const cell of head) {
			headRowContent.push(await buildCell(cell, CellType.tableHeader));
		}

		for (const row of rows) {
			const cells = splitTableLine(row);

			const cellsNodes: any[] = [];
			for (const cell of cells) {
				cellsNodes.push(await buildCell(cell, CellType.tableCell));
			}
			tableRows.push({
				type: 'tableRow',
				content: cellsNodes
			});
		}

		return {
			node: {
				type: 'table',
				content: [
					{
						type: 'tableRow',
						content: headRowContent
					},
					...tableRows
				]
			},
			consumed: whole.length
		};
	}
};
