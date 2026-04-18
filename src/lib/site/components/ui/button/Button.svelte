<script lang="ts">
  import { type Props } from './index.js';

  let {
    class: className,
    variant = 'default',
    size = 'default',
    ref = $bindable(null),
    href = undefined,
    type = 'button',
    icon,
    children,
    ...restProps
  }: Props = $props();
</script>

{#snippet iconProp()}
  {#if icon}
    {@const IconProp = icon}
    <div class="button__icon">
      <IconProp size={size === 'icon-sm' ? 12 : 16} strokeWidth="2px" />
    </div>
  {/if}
{/snippet}

{#if href}
  <a
    bind:this={ref}
    {href}
    class="button button--size-{size} button--{variant} {className}"
    {...restProps}
  >
    {@render iconProp()}
    {@render children?.()}
  </a>
{:else}
  <button
    bind:this={ref}
    class="button button--size-{size} button--{variant} {className}"
    {type}
    {...restProps}
  >
    {@render iconProp()}
    {@render children?.()}
  </button>
{/if}

<style type="postcss">
  :root {
    --button-border-radius: var(--border-radius, var(--size-6));
  }
  .button {
    --local-space-inline: var(--space-inline, var(--size-4));
    --local-color: var(--color, unset);
    --local-font-size: var(--font-size, var(--font-size-text-md));
    flex-shrink: var(--flex-shrink, unset);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--button-border-radius);
    white-space: nowrap;
    transition-property:
      box-shadow, color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-duration: 0.25s;
    gap: var(--size-2);
    font-size: var(--local-font-size);
    position: relative;
    color: var(--local-color);
    font-variation-settings: 'wght' 600;
  }

  .button:focus-visible {
    /* --ring-offset: 1px; */
    outline: none;
    @mixin ring var(--color-ring);
  }

  .button:disabled,
  .button[disabled='true'] {
    opacity: 0.7;
    cursor: no-drop !important;
  }

  /**************************************/
  /* Sizes */
  /**************************************/

  .button--size-default {
    height: var(--size-9);
    padding: var(--size-2) var(--local-space-inline);
  }

  .button--size-sm {
    border-radius: var(--button-border-radius, var(--size-8));
    --local-space-inline: var(--space-inline, var(--size-3));
    height: var(--size-8);
    padding: var(--size-2) var(--local-space-inline);
    font-size: var(--local-font-size, var(--font-size-text-sm));
  }

  .button--size-lg {
    --button-border-radius: var(--border-radius, var(--size-2));
    --local-space-inline: var(--space-inline, var(--size-8));
    height: var(--size-12);
    padding: var(--size-2) var(--local-space-inline);
  }

  .button--size-xl {
    --button-border-radius: var(--border-radius, var(--size-8));
    --local-space-inline: var(--space-inline, var(--size-8));
    height: var(--size-14);
    padding: var(--size-2) var(--local-space-inline);
  }

  .button--size-icon {
    --button-border-radius: var(--border-radius, var(--size-1));
    height: var(--size-8);
    width: var(--size-8);
    :global(svg) {
      width: 100%;
      height: 100%;
    }
  }

  .button--size-icon-sm {
    --button-border-radius: var(--border-radius, var(--size-1));
    height: var(--size-6);
    width: var(--size-6);
    :global(svg) {
      width: 100%;
      height: 100%;
    }
  }

  /**************************************/
  /* Gradient
	/**************************************/

  .button--gradient::before {
    position: absolute;
    inset: 0;
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    background: linear-gradient(90deg, #ff8038 0%, #ff0099 30.43%, #00ebeb 68.23%, #db00ff 100%);
    background-size: 600% 600%;
    border-radius: var(--button-border-radius);
    content: '';
    animation: AnimateBorder 4s ease infinite;
    -webkit-animation: AnimateBorder 4s ease infinite;
    -moz-animation: AnimateBorder 4s ease infinite;
    z-index: -2;
    transform: translate(-1px, -1px);
    transition: opacity 0.3s ease-in-out;
  }
  .button--gradient::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: var(--button-border-radius);
    background-color: var(--color-bg);
  }

  /**************************************/
  /* Default
	/**************************************/
  .button--default {
    background-color: oklch(from var(--color-fg) l c h);
    color: var(--color-bg);
  }
  .button--default:hover {
    background-color: var(--color-fg);
    box-shadow: 0 0 1px 5px oklch(from var(--color-fg) l c h / 0.2);
  }
  .button--default:disabled {
    background-color: oklch(var(--light-11) 0 0);
  }

  /**************************************/
  /* Outline
	/**************************************/
  .button--outline {
    border: 1px solid oklch(var(--light-8) 0 0);
    background-color: oklch(var(--light-3) 0 0 / 0);
    color: var(--color-fg);
    &:hover {
      background-color: oklch(var(--light-3) 0 0 / 1);
    }
  }

  /**************************************/
  /* Ghost
	/**************************************/
  .button--ghost {
    background-color: oklch(from var(--color-bg--accent) l c h / 0);
    &:hover {
      background-color: var(--color-bg--accent);
    }
  }

  /**************************************/
  /* Secondary
	/**************************************/
  .button--secondary {
    background-color: var(--color-bg--accent);
    color: var(--color-fg);
    fill: var(--color-bg--accent);
    &:hover {
      background-color: oklch(from var(--color-bg--accent) l c h / 0.8);
    }
  }

  /**************************************/
  /* Secondary
	/**************************************/
  .button--opacity {
    background-color: transparent;
    fill: currentColor;
    color: currentColor;
    opacity: 0.6;
    transition: opacity 0.3s ease-in-out;
    &:hover {
      opacity: 1;
    }
  }

  /**************************************/
  /* Link
	/**************************************/
  .button--link {
    padding-left: 0;
    padding-right: 0;
    background: none;
    position: relative;
  }

  .button--link::before {
    content: '';
    position: absolute;
    transform-origin: right;
    transition: transform 300ms;
    transform: scaleX(0);
    left: 0;
    right: 0;
    bottom: 0em;
    border-top: 0.08em solid currentColor;
  }

  .button--link:hover::before {
    transform: scaleX(1);
    transform-origin: left;
  }

  /**************************************/
  /* With Icon */
  /**************************************/

  .button__icon {
    display: grid;
    place-content: center;
    border-radius: var(--radius-sm);
    width: var(--size-5);
    height: var(--size-5);
  }

  @-webkit-keyframes AnimateBorder {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @-moz-keyframes AnimateBorder {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @keyframes AnimateBorder {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
</style>
