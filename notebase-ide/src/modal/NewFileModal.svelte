<script>
  import {clickOutside} from "../util";
  import {sModal} from "./store";

</script>

<div class:invisible={!$sModal.visible}
     class="absolute left-0 top-0 w-full h-full flex justify-center items-center bg-black bg-opacity-25">

    <div use:clickOutside
         on:outclick={() => sModal.hide()}
         class="p-3 shadow-md bg-white rounded-md">
        <div>New File</div>
        <input type="text" bind:value={$sModal.value}/>
        <button on:click={() => sModal.onNew()}>Submit</button>
    </div>
</div>

<style lang="scss">

</style>
