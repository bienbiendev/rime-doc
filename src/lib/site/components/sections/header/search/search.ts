import type { JSONContent } from '@tiptap/core';
import { richTextJSONToText } from 'rimecms/fields/rich-text';
import { string } from 'rimecms/util';
import type { SearchIndex } from './type';

// Recursively extract plain text, skipping codeBlock and table nodes at any depth
function nodeToPlainText(node: JSONContent): string {
  if (node.type === 'codeBlock') return '';
  if (node.type === 'table') return '';
  if (node.text) return node.text;
  if (node.content) return node.content.map(nodeToPlainText).join('');
  return '';
}

export function createSearchIndex(pages: PagesDoc[]): SearchIndex {
  const index: SearchIndex = [];

  for (const page of pages) {
    if (!page.url) continue;

    let nodes: JSONContent[] = [];
    try {
      const jsonContent = page.content.text;
      if (jsonContent) {
        const parsed = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;
        nodes = parsed.content || [];
      }
    } catch {
      // skip malformed content
    }

    // Page-level entry: all content minus codeBlocks
    const pageContent = nodes.map(nodeToPlainText).filter(Boolean).join('\n');

    index.push({
      id: page.id,
      weight: 1, // boost page-level entries above section-level entries
      title: page.attributes.longTitle || page.attributes.title!,
      keywords: [
        page.attributes.longTitle || page.attributes.title!,
        ...(page.attributes.categories || [])
      ],
      content: pageContent,
      summary: page.attributes.summary || '',
      url: page.url
    });

    // Per-h2 section entries
    let i = 0;
    while (i < nodes.length) {
      const node = nodes[i];
      if (node.type === 'heading' && node.attrs?.level === 2) {
        const h2Title = richTextJSONToText(node);
        const slug = string.slugify(h2Title);

        i++;
        const sectionLines: string[] = [];
        while (i < nodes.length) {
          if (nodes[i].type === 'heading' && nodes[i].attrs?.level === 2) break;
          const text = nodeToPlainText(nodes[i]);
          if (text) sectionLines.push(text);
          i++;
        }

        index.push({
          id: `${page.id}-${slug}`,
          weight: 0.5, // boost section entries below page-level entry
          title: `${page.attributes.longTitle || page.attributes.title!} - ${h2Title}`,
          keywords: [h2Title, page.attributes.longTitle || page.attributes.title!],
          content: sectionLines.join('\n'),
          summary: page.attributes.summary || '',
          url: `${page.url}#${slug}`
        });
      } else {
        i++;
      }
    }
  }

  return index;
}

export function getOccurrences(content: string, search: string): string[] {
  if (!search || !content) return [];

  const words = content.split(/\s+/);

  // Build the character offset of each word's start
  const offsets: number[] = [];
  let pos = 0;
  for (const word of words) {
    offsets.push(pos);
    pos += word.length + 1; // +1 for the whitespace separator
  }

  const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'gi');
  const occurrences: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const matchStart = match.index;
    const matchEnd = match.index + match[0].length;

    // Last word whose offset is ≤ matchStart
    let startWord = 0;
    for (let i = offsets.length - 1; i >= 0; i--) {
      if (offsets[i] <= matchStart) {
        startWord = i;
        break;
      }
    }

    // Last word whose offset is < matchEnd (handles multi-word matches)
    let endWord = startWord;
    for (let i = offsets.length - 1; i >= 0; i--) {
      if (offsets[i] < matchEnd) {
        endWord = i;
        break;
      }
    }

    const from = Math.max(0, startWord - 4);
    const to = Math.min(words.length, endWord + 1 + 12);
    const snippet = words.slice(from, to).join(' ');
    const highlighted = snippet.replace(
      new RegExp(escaped, 'gi'),
      (m) => `<span class="highlight">${m}</span>`
    );
    occurrences.push(highlighted);
  }

  return occurrences;
}
