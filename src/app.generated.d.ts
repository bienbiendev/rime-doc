import 'rimecms';
import type { Session } from 'better-auth';
import type { BaseDoc, Navigation, User, UploadDoc } from 'rimecms/types'


export type RelationValue<T> =
	| T[] // When depth > 0, fully populated docs
	| { id?: string; relationTo: string; documentId: string }[] // When depth = 0, relation objects
	| string[]
	| string; // When sending data to update
declare global {

export type StaffDoc = BaseDoc &  {
  name: string
	email: string
	roles: ('admin' | 'staff')[]
	editedBy?: string
	createdAt?: Date
	updatedAt?: Date;
	[x: string]: unknown;
}

export type PagesDoc = BaseDoc &  {
  attributes: {title?: string,
		isHome: boolean,
		slug?: string,
		longTitle?: string,
		summary?: string,
		categories?: ('fields' | 'configuration' | 'guides' | 'api')[],
		icon?: string},
	content: {text?: import('@tiptap/core').JSONContent}
	_parent?: string
	_position?: number
	url?: string
	editedBy?: string
	createdAt?: Date
	updatedAt?: Date;
	[x: string]: unknown;
}

export type MediasDoc = BaseDoc & UploadDoc &  {
  alt: string
	mimeType?: string
	filename?: string
	filesize?: string
	_path?: string
	editedBy?: string
	createdAt?: Date
	updatedAt?: Date
		sizes:{thumbnail: string};
	[x: string]: unknown;
}

export type Medias_directoriesDoc = BaseDoc &  {
  id: string
	name?: string
	parent?: string
	createdAt?: Date
	updatedAt?: Date;
	[x: string]: unknown;
}

export type NavDoc = BaseDoc &  {
  main: Array<TreeMain>,
	editedBy?: string
	createdAt?: Date
	updatedAt?: Date;
	[x: string]: unknown;
}

export type TreeMain = {
  id: string;
  path?: string
position?: number
label?: string
pages?: {
		type: 'pages';
		value: string | null;
		target: '_self' | '_blank';
		url?: string;
};
	_children: TreeMain[]
}



}
declare global {
  namespace App {
    interface Locals {
			/** Flag only ON when create the first panel user */
			isInit?: boolean;
			/** The better auth session */
      session: Session | undefined;
			/** The rime user document when authenticated */
      user: User | undefined;
			/**
			 * Flag enabled when a create operation is triggered
			 * by a auth/sign-up api call.
			 */
			isAutoSignIn?: boolean;
			/** The full better-auth user */
			betterAuthUser:
			| {
					id: string;
					name: string;
					email: string;
					emailVerified: boolean;
					createdAt: Date;
					updatedAt: Date;
					role?: string | null | undefined;
					banned: boolean | null | undefined;
					banReason?: string | null | undefined;
					banExpires?: Date | null | undefined;
					type: string;
				}
			| undefined;
			/** Singleton providing access to auth, config and local-api */
      rime: ReturnType<
				Awaited<
					typeof import('./lib/+rime.generated/rime.config.server.ts').default
				>['createRimeContext']
			>;
      /** Flag enabled by the core plugin rime.cache when the API cache is ON */
      cacheEnabled: boolean;
      /** Available in panel, routes for sidebar */
      routes: Navigation;
			/**
			 * Current locale if applicable
			 * set following this prioroty :
			 * - locale inside the url from your front-end ex: /en/foo
			 * - locale from searchParams ex : ?locale=en
			 * - locale from cookie
			 * - default locale
			*/
      locale: string | undefined;
    }
  }
}
declare module 'rimecms' {
	interface RegisterCollection {
		'staff': StaffDoc
		'pages': PagesDoc
		'medias': MediasDoc
		'medias_directories': Medias_directoriesDoc;
	}
	interface RegisterArea {
		'nav': NavDoc;
	}
}