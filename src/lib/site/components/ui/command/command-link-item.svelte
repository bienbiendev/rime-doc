<script lang="ts">
  import { Command as CommandPrimitive } from 'bits-ui';
  import './command-link-item.css';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: CommandPrimitive.LinkItemProps = $props();
</script>

<CommandPrimitive.LinkItem class="command-link-item {className}" bind:ref {...restProps} />
