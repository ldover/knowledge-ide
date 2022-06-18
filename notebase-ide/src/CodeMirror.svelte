<script>

  import {onMount} from "svelte";
  import {sEditor} from "./store";

  onMount(() => {
    sEditor.setValue("Hello\n\n```javascript\nlet x = 'y'\n```",)
  })


</script>

<div bind:this={$sEditor.el}
     class="h-full"
>

</div>

<style lang="scss">

</style>
