<script>

  import {onMount} from "svelte";
  import {sEditor} from "./store";

  let el;

  onMount(() => {
    sEditor.init(el);
  })


</script>

<div bind:this={el}
     class="h-full"
>

</div>

<style lang="scss">

</style>
