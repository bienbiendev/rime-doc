
import type { ServerLoadEvent } from '@sveltejs/kit';
export const load = async ({ locals, url }: ServerLoadEvent) => {
	return { user: locals.user };
};