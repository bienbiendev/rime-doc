import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
import Content from './dropdown-menu-content.svelte';
import Item from './dropdown-menu-item.svelte';
import Trigger from './dropdown-menu-trigger.svelte';

const Sub = DropdownMenuPrimitive.Sub;
const Root = DropdownMenuPrimitive.Root;
const Group = DropdownMenuPrimitive.Group;
const RadioGroup = DropdownMenuPrimitive.RadioGroup;
const Portal = DropdownMenuPrimitive.Portal;

export {
	Content,
	//
	Root as DropdownMenu,
	Content as DropdownMenuContent,
	Group as DropdownMenuGroup,
	Item as DropdownMenuItem,
	RadioGroup as DropdownMenuRadioGroup,
	Sub as DropdownMenuSub,
	Trigger as DropdownMenuTrigger,
	Group,
	Item,
	Portal,
	RadioGroup,
	Root,
	Sub,
	Trigger
};
