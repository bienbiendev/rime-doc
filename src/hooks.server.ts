import { sequence } from '@sveltejs/kit/hooks';
import { handlers } from 'rimecms';
import config from './lib/+rime.generated/rime.config.server.js';

export const handle = sequence(...(await handlers(config)), async ({ event, resolve }) => {
  const result = await resolve(event, {
    transformPageChunk: ({ html }) => {
      if (event.locals.theme) {
        return html.replace('%theme%', event.locals.theme.value);
      }
      return html;
    }
  });
  return result;
});
