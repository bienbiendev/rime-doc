import { trycatchFetch } from '@bienbien/trycatch';
import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import { markdownToJson } from './md-json-convert/index.js';
import { signIn } from './sign-in.js';

const root = process.cwd();
const mdDir = path.join(root, 'docs');

const headers = await signIn(process.env.FEED_USER || '', process.env.FEED_PASSWORD || '');

interface FileEntry {
  slug: string;
  uri: string;
  path: string;
  content: string;
  position: number;
  isParent: boolean;
  parent: string | null;
}

interface PageDoc {
  id: string;
  url?: string;
  attributes?: {
    slug: string;
    title: string;
    longTitle: string;
  };
}

interface ApiResponse<T> {
  docs: T[];
  doc?: T;
}

interface PageCreateData {
  _position: number;
  attributes: {
    title: string;
    slug: string;
    longTitle: string;
  };
  content: {
    text: any;
  };
  _parent?: string;
}

interface PageUpdateData {
  _position: number;
  attributes: {
    categories: string[];
  };
  content: {
    text: any;
  };
}

/**
 * Extracts the position from a filename by getting the last non-zero number in the prefix.
 * If the last number is all zeros, use the previous non-zero number.
 * @example
 * extractPosition('03-00-configuration.md') // 3
 * extractPosition('128-01-00-installation.md') // 1
 * extractPosition('128-00-00-config.md') // 128
 * extractPosition('04-0128-something.md') // 128
 * @param filename - The filename to parse
 * @returns The last non-zero number in the prefix as integer
 */
function extractPosition(filename: string): number {
  // Extract all numbers from the beginning of the filename
  const match = filename.match(/^(\d+(?:-\d+)*)/);
  if (!match) {
    return 0;
  }

  const numbers = match[1].split('-');

  // Go backwards through the numbers to find the first non-zero one
  for (let i = numbers.length - 1; i >= 0; i--) {
    const num = parseInt(numbers[i], 10);
    if (num !== 0) {
      return num;
    }
  }

  // If all numbers are zero, return 0
  return 0;
}

function isParent(filename: string) {
  return /^00-/.test(filename);
}

/**
 * Converts a file path with numeric prefixes to a clean URI path.
 * Removes numeric prefixes, converts double underscores to slashes, and removes file extensions.
 * @param filePath - the file path
 * @example
 * convertPathToUri('03-01-configuration__collections.md') // 'configuration/collections'
 * convertPathToUri('02-installation.md') // 'installation'
 * convertPathToUri('03-configuration/01-collections.md') // 'configuration/collections'
 * convertPathToUri('03-configuration/00-overview.md') // 'configuration'
 * convertPathToUri('05-fields/00-overview.md#fields-shared-methods') // 'fields#fields-shared-methods'
 */
export function convertPathToUri(filePath: string): string {
  // Preserve anchor fragment through conversion
  const hashIdx = filePath.indexOf('#');
  const anchor = hashIdx !== -1 ? filePath.slice(hashIdx) : '';
  const pathOnly = hashIdx !== -1 ? filePath.slice(0, hashIdx) : filePath;

  const segments = pathOnly.replace(/\.md$/, '').split('/');

  // A file prefixed with 00- inside a subdirectory is the index of that directory;
  // drop the file segment so its URI equals the parent directory's URI.
  const lastSeg = segments[segments.length - 1];
  if (segments.length > 1 && /^00-/.test(lastSeg)) {
    segments.pop();
  }

  return (
    segments
      .map(
        (seg) =>
          seg
            .replace(/^\d+-\d*-?/, '') // Strip numeric prefix from each segment
            .replace(/__/g, '/') // Legacy: convert __ to path separator
      )
      .filter(Boolean)
      .join('/') + anchor
  );
}

/**
 * Scans a directory recursively and returns file entries
 * @param dir - the directory to scan
 * @returns set of files with info
 */
function scanDir(dir: string): Set<FileEntry> {
  const files = new Set<FileEntry>();
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const subFiles = scanDir(fullPath);
      subFiles.forEach((file) => files.add(file));
    } else if (!entry.name.includes('DS_Store')) {
      const relative = path.relative(mdDir, fullPath);
      const uri = convertPathToUri(relative);
      const parent = uri.split('/').length > 1 ? uri.split('/').at(-2) || null : null;
      const content = readFileSync(fullPath, { encoding: 'utf-8' });

      files.add({
        slug: uri.split('/').at(-1) || '',
        parent,
        isParent: isParent(entry.name),
        position: extractPosition(entry.name),
        content,
        uri,
        path: relative
      });
    }
  }
  return new Set(Array.from(files).sort((a, b) => a.path.localeCompare(b.path)));
  // return files;
}

/**
 * Gets a parent page by slug
 */
async function getParent(slug: string): Promise<PageDoc | null> {
  const response = await fetch(
    `${process.env.PUBLIC_RIME_URL}/api/pages?where[attributes.slug][equals]=${slug}`,
    {
      method: 'GET',
      headers
    }
  );

  if (response.status === 200) {
    const data: ApiResponse<PageDoc> = await response.json();
    if (!data.docs.length) return null;
    return data.docs[0];
  }
  return null;
}

/**
 * Capitalizes a string
 */
export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Creates a new page
 */
async function createPage(file: FileEntry): Promise<string> {
  let parent: PageDoc | null = null;

  if (file.parent) {
    parent = await getParent(file.parent);
    if (!parent) throw new Error(`Parent ${file.parent} don't exists`);
  }

  const content = await markdownToJson(file.content);

  const baseData: PageCreateData = {
    _position: file.position,
    attributes: {
      title: capitalize(file.slug),
      slug: file.slug,
      longTitle: capitalize(file.slug)
    },
    content: {
      text: content
    }
  };

  const data = parent ? { ...baseData, _parent: parent.id } : baseData;

  const response = await fetch(`${process.env.PUBLIC_RIME_URL}/api/pages`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers
  });

  if (response.status !== 200) {
    throw new Error(`Error while creating /${file.uri}`);
  }

  const result: ApiResponse<PageDoc> = await response.json();
  return result.doc?.id || '';
}

/**
 * Get the current nav document
 */
async function getNav(): Promise<NavDoc> {
  const [err, response] = await trycatchFetch(`${process.env.PUBLIC_RIME_URL}/api/nav`);
  if (err) throw err;
  const { doc } = await response.json();
  return doc;
}

/**
 * Updates an existing page
 */
async function updatePage(file: FileEntry, id: string): Promise<PagesDoc> {
  const content = await markdownToJson(file.content);
  const data: PageUpdateData = {
    _position: file.position,
    attributes: {
      categories: file.parent ? [file.parent] : []
    },
    content: {
      text: content
    }
  };

  const [err, response] = await trycatchFetch(`${process.env.PUBLIC_RIME_URL}/api/pages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers
  });

  if (err) {
    console.log(response);
    throw new Error(`Error with ${file.uri}`);
  }

  console.log(`[√] /${file.uri} (${id}) updated`);
  const { doc } = await response.json();
  return doc;
}

export const feed = async (): Promise<void> => {
  //
  async function run(): Promise<void> {
    const files = scanDir(mdDir);
    const uriMapId = new Map<string, string>();
    const idMapDoc = new Map<string, PagesDoc>();

    // First pass: check existing pages and create missing ones
    for (const file of Array.from(files)) {
      const docUrl = `${process.env.PUBLIC_RIME_URL}/docs/${file.uri}`;

      const response = await fetch(
        `${process.env.PUBLIC_RIME_URL}/api/pages?where[url][equals]=${encodeURIComponent(docUrl)}`,
        {
          method: 'GET',
          headers
        }
      );

      if (response.status === 200) {
        const data: ApiResponse<PageDoc> = await response.json();
        if (!data.docs.length) {
          console.warn(docUrl, 'not found -> create');
          const id = await createPage(file);
          uriMapId.set(file.uri, id);
        } else {
          uriMapId.set(file.uri, data.docs[0].id);
        }
      } else {
        throw Error(String(response.status) + ' ' + (await response.text()));
      }
    }

    // Second pass: update all pages
    for (const file of Array.from(files)) {
      const id = uriMapId.get(file.uri);
      if (!id) {
        throw new Error(`Missing /${file.uri} id in Map`);
      }
      const doc = await updatePage(file, id);
      idMapDoc.set(id, doc);
    }

    // 3rd update menu
    function hasParent(file: FileEntry): file is FileEntry & { parent: string } {
      return file.parent !== null;
    }
    function isOrphean(file: FileEntry): file is FileEntry & { parent: null } {
      return file.parent === null;
    }

    const nav = await getNav();
    const filesWithParent = Array.from(files).filter(hasParent);
    const parentMap = Object.groupBy(filesWithParent, ({ parent }) => parent);
    type MainNavItem = Omit<NavDoc['main'][number], 'id' | '_children'> & {
      _children: MainNavItem[];
    };
    const mainNav: MainNavItem[] = [];

    function getDocByURI(uri: string) {
      const id = uriMapId.get(uri);
      if (!id) throw Error("Can't find id for " + uri);
      const doc = idMapDoc.get(id);
      if (!doc) throw Error("Can't find doc for " + id);
      return doc;
    }

    function childToNavItem(child: FileEntry, index: number): MainNavItem {
      const doc = getDocByURI(child.uri);
      return {
        label: doc.title,
        pages: {
          type: 'pages',
          value: doc.id,
          target: '_self'
        },
        position: index + 1,
        _children: []
      };
    }

    console.log('Building nav...');
    for (const [index, file] of Array.from(files).filter(isOrphean).entries()) {
      const doc = getDocByURI(file.uri);

      if (file.isParent) {
        const children = (parentMap[file.slug] || []).sort((a, b) => a.position - b.position);
        const overview: MainNavItem = {
          label: 'Overview',
          position: 0,
          pages: {
            type: 'pages',
            value: doc.id,
            target: '_self'
          },
          _children: []
        };
        mainNav.push({
          label: doc.title,
          pages: undefined,
          position: index,
          _children: [overview, ...children.map(childToNavItem)]
        });
      } else {
        mainNav.push({
          label: doc.title,
          pages: {
            type: 'pages',
            value: doc.id,
            target: '_self'
          },
          position: index,
          _children: []
        });
      }
    }

    const [err] = await trycatchFetch(`${process.env.PUBLIC_RIME_URL}/api/nav`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        ...nav,
        main: mainNav
      })
    });
    if (err) throw Error('Error while updating nav, status:' + err.status);
    console.log('[√] Nav updated');
  }

  try {
    await run();
  } catch (err) {
    console.log(err);
  }
};

// if (require.main === module) {
feed();
// }
