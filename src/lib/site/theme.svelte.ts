import Cookie from 'js-cookie';
import { getContext, setContext, untrack } from 'svelte';

export const MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const;

export type Mode = (typeof MODES)[keyof typeof MODES];
export type Theme = 'dark' | 'light';

export type ThemeState = {
  value: Theme;
  mode: Mode;
};

function createThemeState(initial: ThemeState) {
  //

  let mode = $state<Mode>(initial.mode);
  let systemPrefersDark = $state<boolean>();

  const theme = $derived.by(() => {
    if (mode === MODES.SYSTEM) {
      return systemPrefersDark === undefined
        ? initial.value
        : systemPrefersDark
          ? MODES.DARK
          : MODES.LIGHT;
    }
    return mode;
  });

  $effect(() => {
    if (theme) {
      document.querySelector('html')?.setAttribute('data-theme', theme);
      Cookie.set('theme.value', $state.snapshot(theme));
    }
  });

  function initSystemListener() {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    systemPrefersDark = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      systemPrefersDark = e.matches;
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }

  $effect(() => {
    untrack(() => initSystemListener());
  });

  return {
    get mode() {
      return mode;
    },

    set mode(value: Mode) {
      Cookie.set('theme.mode', value);
      mode = value;
    },

    get value() {
      return theme;
    }
  };
}

export const THEME_CTX = Symbol('rime-doc.theme');

export function setThemeContext(arg: ThemeState = { value: 'dark', mode: MODES.DARK }) {
  const store = createThemeState(arg);
  return setContext(THEME_CTX, store);
}

export function getThemeContext() {
  return getContext<ReturnType<typeof createThemeState>>(THEME_CTX);
}
