import { Command as CommandPrimitive } from 'bits-ui';

import Empty from './command-empty.svelte';
import Input from './command-input.svelte';
import List from './command-list.svelte';
import Root from './command.svelte';
// import Shortcut from './command-shortcut.svelte';
import LinkItem from './command-link-item.svelte';

const Loading = CommandPrimitive.Loading;
const Viewport = CommandPrimitive.Viewport;

export {
  Root as Command,
  Empty as CommandEmpty,
  Input as CommandInput,
  LinkItem as CommandLinkItem,
  List as CommandList,
  Loading as CommandLoading,
  Empty,
  Input,
  LinkItem,
  List,
  Loading,
  Root,
  Viewport
};
