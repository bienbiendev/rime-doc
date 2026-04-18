<script lang="ts">
  import { Command as CommandPrimitive } from 'bits-ui';
  import './command-list.css';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: CommandPrimitive.ListProps = $props();
</script>

<CommandPrimitive.List class="command-list {className}" {...restProps} bind:ref />
