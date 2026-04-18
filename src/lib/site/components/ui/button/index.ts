import type { WithElementRef } from 'bits-ui';
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
import Button from './Button.svelte';

export type ButtonVariant =
	| 'default'
	| 'ghost'
	| 'link'
	| 'secondary'
	| 'outline'
	| 'gradient'
	| 'opacity';

export type ButtonSize = 'default' | 'sm' | 'lg' | 'xl' | 'icon' | 'icon-sm';

type Props = WithElementRef<HTMLButtonAttributes> &
	WithElementRef<HTMLAnchorAttributes> & {
		variant?: ButtonVariant;
		size?: ButtonSize;
		icon?: any;
		disabled?: boolean;
	};

export { Button, type Props };
