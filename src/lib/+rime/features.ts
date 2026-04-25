import { Collection } from '$rime/config';
import {
  Bolt,
  Cpu,
  Languages,
  Palette,
  Pencil,
  Puzzle,
  Rocket,
  Server,
  Settings,
  ShieldUser,
  TextCursorInput
} from '@lucide/svelte';
import { combobox, select, text } from 'rimecms/fields';

export const features = Collection.create('features', {
  panel: {
    group: 'content'
  },
  access: {
    read: () => true
  },
  nested: true,
  fields: [
    text('title').isTitle(),
    text('description'),
    select('scope').options('Administration', 'Content', 'Developper experience').many(),
    combobox('icon').options(
      { value: 'Bolt', label: 'Bolt', icon: Bolt },
      { value: 'Cpu', label: 'Cpu', icon: Cpu },
      { value: 'Languages', label: 'Languages', icon: Languages },
      { value: 'Palette', label: 'Palette', icon: Palette },
      { value: 'Pencil', label: 'Pencil', icon: Pencil },
      { value: 'Puzzle', label: 'Puzzle', icon: Puzzle },
      { value: 'Rocket', label: 'Rocket', icon: Rocket },
      { value: 'ShieldUser', label: 'ShieldUser', icon: ShieldUser },
      { value: 'Server', label: 'Server', icon: Server },
      { value: 'Settings', label: 'Settings', icon: Settings },
      { value: 'TextCursorInput', label: 'TextCursorInput', icon: TextCursorInput }
    )
  ]
});
