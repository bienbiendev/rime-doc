import type { ParseMarkdownFn, ParseResult } from '../index.js';

/**
 * Ordered list node renderer
 */

export const orderedListRenderer = {
  type: 'node',
  matcher: /^\d+\.\s/,

  /**
   * Checks if markdown line should be treated as an orderedList
   */
  match(input: string) {
    return input.match(this.matcher);
  },

  /**
   * Parses markdown orderedList to JSON.
   * Each numbered line starts an item; all subsequent lines with strictly
   * more indentation (or blank lines that peek ahead to still-indented
   * content) are collected as part of that item and passed to parseMarkdown.
   */
  async renderJSON(
    input: string,
    params: {
      renderers: any[];
      parseMarkdown: ParseMarkdownFn;
    }
  ): Promise<ParseResult | null> {
    const { renderers, parseMarkdown } = params;

    if (!this.matcher.test(input)) return null;

    const lines = input.split('\n');
    const listItems: any[] = [];
    let cursor = 0;

    const firstMatch = lines[0].match(/^(\d+)/);
    const start = Number(firstMatch ? firstMatch[1] : 1);

    while (cursor < lines.length) {
      // Skip blank lines between items
      while (cursor < lines.length && lines[cursor].trim() === '') cursor++;
      if (cursor >= lines.length) break;

      const line = lines[cursor];
      const numberedMatch = line.match(/^(\s*)(\d+)\.\s+(.*)/);
      if (!numberedMatch) break;

      const itemBaseIndent = numberedMatch[1].length;
      const itemLines: string[] = [numberedMatch[3]];
      let continuationIndent = -1;
      cursor++;

      // Collect continuation lines (blank or more-indented than the numbered line)
      while (cursor < lines.length) {
        const nextLine = lines[cursor];

        if (nextLine.trim() === '') {
          // Peek ahead: only keep blank line if the next non-blank line
          // is still more indented than the item base
          let peek = cursor + 1;
          while (peek < lines.length && lines[peek].trim() === '') peek++;

          if (peek >= lines.length) break;

          const peekIndent = lines[peek].match(/^( *)/)?.[1].length ?? 0;
          if (peekIndent <= itemBaseIndent) break;

          itemLines.push('');
          cursor++;
        } else {
          const lineIndent = nextLine.match(/^( *)/)?.[1].length ?? 0;
          if (lineIndent <= itemBaseIndent) break;

          if (continuationIndent === -1) continuationIndent = lineIndent;
          itemLines.push(nextLine.slice(continuationIndent));
          cursor++;
        }
      }

      // Trim trailing blank lines
      while (itemLines.length > 0 && itemLines[itemLines.length - 1].trim() === '') {
        itemLines.pop();
      }

      listItems.push({
        content: await parseMarkdown(itemLines.join('\n'), renderers),
        type: 'listItem'
      });
    }

    if (listItems.length === 0) return null;

    // Compute consumed character count from the lines we processed
    let consumed = 0;
    for (let i = 0; i < cursor; i++) {
      consumed += lines[i].length + 1; // +1 for \n
    }
    consumed = Math.min(consumed, input.length);

    return {
      node: {
        attrs: {
          start,
          type: null
        },
        content: listItems,
        type: 'orderedList'
      },
      consumed
    };
  }
};
