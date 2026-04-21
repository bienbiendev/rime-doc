// See https://svelte.dev/docs/kit/types#app.d.ts

import type { ThemeState } from '$lib/site/theme.svelte';

// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      theme: ThemeState;
    }
  }

  type PaginationLink = { title: string; description?: string; url: string };
  type Pagination = {
    prev: PaginationLink | null;
    next: PaginationLink | null;
  };
}

export {};
