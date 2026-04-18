import {
  Blocks,
  Bolt,
  Code,
  Cpu,
  FileStack,
  Languages,
  ListTree,
  PencilRuler,
  Radio,
  ShieldUser,
  TextCursorInput,
  type IconProps
} from '@lucide/svelte';
import type { Component } from 'svelte';

interface Card {
  uptitle: string;
  title: string;
  icon: Component<IconProps>;
  description: string;
  link: string;
}

class Feature {
  payload: Partial<Card> = {};

  constructor(title: string) {
    this.payload.title = title;
  }

  uptitle(str: string) {
    this.payload.uptitle = str;
    return this;
  }

  description(str: string) {
    this.payload.description = str;
    return this;
  }

  icon(icon: Component<IconProps>) {
    this.payload.icon = icon;
    return this;
  }

  clone() {
    if (!this.payload.title) throw Error('Attempt to clone an untitled feature');
    const feature = new Feature(this.payload.title);
    feature.payload = { ...this.payload };
    return feature;
  }

  out() {
    const output = this.payload;
    if (!output.title) throw Error('missing title');
    if (!output.uptitle) throw Error('missing uptitle');
    if (!output.description) throw Error('missing description');
    if (!output.icon) throw Error('missing icon');
    return output as Card;
  }
}

const SCOPES = {
  ADMIN: 'Administration',
  CONTENT: 'Content',
  DEV: 'Developper experience'
};

const feature = (title: string) => new Feature(title);

export default {
  features: [
    feature('Easy configuration')
      .uptitle(SCOPES.DEV)
      .description('Great Typescript support, and a simple and friendly API.')
      .icon(Bolt)
      .out(),

    feature('Typescript')
      .uptitle(SCOPES.DEV)
      .description('Great Typescript support from the config to your front-end.')
      .icon(Cpu)
      .out(),

    feature('Powerfull rich text editor')
      .uptitle(SCOPES.ADMIN)
      .description('A Notion like editor build with tiptap, extensible and easily configurable.')
      .icon(PencilRuler)
      .out(),

    feature('Built-in Auth')
      .uptitle(SCOPES.ADMIN)
      .description('Better-Auth integration with configurable plugins and roles based accounts.')
      .icon(ShieldUser)
      .out(),

    feature('Nested documents')
      .uptitle(SCOPES.CONTENT)
      .description(
        'Enable document nesting to enjoy parent based url generation and tree structure.'
      )
      .icon(ListTree)
      .out(),

    feature('Versions')
      .uptitle(SCOPES.CONTENT)
      .description('Rime comes with a straight forward version system for documents.')
      .icon(FileStack)
      .out(),

    feature('Built-in i18n')
      .uptitle(SCOPES.CONTENT)
      .description('Built-in field based localization system.')
      .icon(Languages)
      .out(),

    feature('API endpoints')
      .uptitle(SCOPES.CONTENT)
      .description('Automatic and extensible API endpoints with query support.')
      .icon(Radio)
      .out(),

    feature('Extensibility')
      .uptitle(SCOPES.DEV)
      .description(
        'You can easily extend rime, using hooks, custom endpoints, handlers, using plugins or from the config.'
      )
      .icon(Blocks)
      .out(),

    feature('Many fields types')
      .uptitle(SCOPES.ADMIN)
      .description(
        'Rime provide various fields type from blocks to simple toggle, and the ability to create your own'
      )
      .icon(TextCursorInput)
      .out(),

    feature('Great dev environment')
      .uptitle(SCOPES.DEV)
      .description(
        'Enjoy schema generation and automatic migration to get real time update in your panel.'
      )
      .icon(Code)
      .out(),

    feature('Live edition')
      .uptitle(SCOPES.ADMIN)
      .description(
        'Use a configurable live edit mode, or Server-Sent Events for real time updates.'
      )
      .icon(Radio)
      .out()
  ]
} as const;
