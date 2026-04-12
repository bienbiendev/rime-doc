import { convertPathToUri } from '../../index.js';
import type { ParseResult } from '../index.js';

export const linkRenderer = {
  type: 'mark',
  inline: true,
  matcher: /\[(?!resource:)([^\]]+)\]\(([^)]+)\)/,
  /**
   * Checks if markdown text contains link formatting
   */
  match(input: string) {
    return input.match(this.matcher);
  },

  /**
   * Converts link match to JSON mark
   */
  async renderJSON(input: string): Promise<ParseResult | null> {
    const group = input.match(this.matcher); // Remove ** and **
    if (!group) return null;

    const [, linkText, value] = group;
    const isExternal = /^https?:\/\//.test(value);
    const href = isExternal
      ? value
      : value.startsWith('#')
        ? value
        : '/docs/' + convertPathToUri(value.replace('/docs/', ''));

    return {
      node: {
        marks: [
          {
            attrs: {
              class: null,
              href,
              rel: 'noopener noreferrer nofollow',
              target: isExternal ? '_blank' : '_self'
            },
            type: 'link'
          }
        ],
        text: linkText,
        type: 'text'
      },
      consumed: linkText.length + value.length + 4
    };
  }
};
