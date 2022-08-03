<script>
  import {clickOutside} from "../util";
  import {sModal} from "./store";

</script>

<div class:invisible={!$sModal.visible}
     class="absolute left-0 top-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">

    <div use:clickOutside
         on:outclick={() => sModal.hide()}
         class="p-3 shadow-md bg-white rounded-md">
      <div class="flex flex-col">
        <div class="text-lg">New {$sModal.type}</div>
        <input type="text"
               bind:this={$sModal.inputEl}
               class="border border-gray-300 rounded-md p-2 w-full my-3"
               bind:value={$sModal.value}
        />
        <button class="bg-teal-700 text-white"
                on:click={() => sModal.onNew()}>
          Submit
        </button>
      </div>
    </div>
</div>

<style lang="scss">

</style>
