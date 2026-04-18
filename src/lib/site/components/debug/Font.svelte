<script lang="ts">
  import { untrack } from 'svelte';

  let containerEl: HTMLDivElement;
  let canva = $state<HTMLCanvasElement>();

  // Create temporary elements with each font size to get computed pixel values
  const sizes = [
    'headline-2xl',
    'headline-xl',
    'headline-lg',
    'headline-md',
    'headline-sm',
    'headline-xs',
    'headline-2xs',
    'headline-eyebrow',
    'text-md',
    'text-sm',
    'text-xs',
    'text-2xs'
  ] as const;

  const titleText = 'Maecenas pulvinar blandit augue. Etiam id sagittis eros.';
  const paragraphText =
    'Curabitur pretium tempus posuere. Vivamus diam lorem, hendrerit eu erat nec, consequat lobortis augue. Donec arcu purus, vestibulum vitae enim nec, tempor rutrum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas luctus iaculis nisi sed auctor. Vivamus est nunc, bibendum eu finibus a, tristique eu ipsum. Proin hendrerit tincidunt lectus, at pellentesque leo volutpat quis. Maecenas ac risus erat. Quisque convallis non odio et finibus. Nullam mauris urna, fermentum eu nulla.';

  type ComputedSizes = Record<(typeof sizes)[number], string>;
  let computedSizes = $state<ComputedSizes>(
    Object.fromEntries(sizes.map((size) => [size, '0px'])) as ComputedSizes
  );

  function updateComputedSizes() {
    if (!containerEl) return;

    const newSizes: Record<(typeof sizes)[number], string> = {} as any;

    sizes.forEach((size) => {
      const tempEl = document.createElement('div');
      tempEl.style.fontSize = `var(--font-size-${size})`;
      tempEl.style.position = 'absolute';
      tempEl.style.visibility = 'hidden';
      document.body.appendChild(tempEl);

      const computedFontSize = getComputedStyle(tempEl).fontSize;
      newSizes[size] = computedFontSize;

      document.body.removeChild(tempEl);
    });

    computedSizes = newSizes;
  }

  function onResize() {
    updateComputedSizes();
  }

  $effect(() => {
    untrack(() => {
      window.addEventListener('resize', onResize);
      // Initial computation
      updateComputedSizes();
    });
    return () => window.removeEventListener('resize', onResize);
  });

  let ctx = $state<CanvasRenderingContext2D | null>(null);
  $effect(() => {
    if (canva) {
      ctx = canva.getContext('2d');
    }
  });

  $effect(() => {
    if (ctx && canva && computedSizes) {
      draw();
    }
  });

  function draw() {
    if (!canva || !ctx) return;

    canva.width = sizes.length * 20;
    canva.height = sizes.length * 20;
    ctx.strokeStyle = 'white';
    ctx.clearRect(0, 0, canva.width, canva.height);
    // draw horizontal line
    ctx.beginPath();
    ctx.moveTo(0, canva.height);
    ctx.lineTo(canva.width, canva.height);
    ctx.stroke();
    // draw vertical line
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, canva.height);
    ctx.stroke();
    // somehow end path before move
    ctx.beginPath();
    ctx.moveTo(0, canva.height - parseFloat(computedSizes[sizes[0]]));
    for (const [i, x] of sizes.entries()) {
      ctx.arc((i + 1) * 17, canva.height - parseFloat(computedSizes[x]) * 1.25, 2, 0, 2 * Math.PI);
      ctx.lineTo((i + 1) * 17, canva.height - parseFloat(computedSizes[x]) * 1.25);
    }
    ctx.stroke();
  }
</script>

<div class="debug-fonts" bind:this={containerEl}>
  {#each Object.entries(computedSizes) as [size, value]}
    <div>{size}: {value}</div>
  {/each}
  <canvas bind:this={canva}></canvas>
</div>

<div class="preview">
  <div class="preview__inner">
    {#each sizes as size}
      <div>
        <span>{size}</span>
        <p style="font-size: var(--font-size-{size})">
          {size.includes('headline') ? titleText : paragraphText}
        </p>
      </div>
    {/each}
  </div>
</div>

<style>
  canvas {
    width: 200px;
    height: 200px;
  }
  .debug-fonts {
    position: fixed;
    z-index: 10001;
    bottom: 2rem;
    right: 2rem;
    color: white;
    padding: 1rem;
    background-color: rgba(20, 20, 20, 1);
  }
  .preview {
    position: fixed;
    top: 2rem;
    left: 2rem;
    right: 2rem;
    bottom: 2rem;
    background-color: white;
    z-index: 10000;
    overflow-y: scroll;

    span {
      font-family: var(--font-mono);
      font-size: var(--font-size-text-2xs);
    }
    .preview__inner {
      max-width: 700px;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 2rem;
      min-height: 0;
    }
  }
</style>
