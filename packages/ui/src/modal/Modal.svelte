<script>
  import {clickOutside} from "../util";
  import {afterUpdate} from "svelte";


  /** @type {import('../typedef').Modal} */
  export let sModal;

  $: visible = $sModal.visible;
  let prevVisible;

  let inputEl;

  afterUpdate(() => {
    if (visible === prevVisible) return;
    if (visible) {
      inputEl.focus()
    }

    prevVisible = visible;
  })

  function onKeyUp(ev) {
    if (ev.key === 'Enter') {
      sModal.submit()
    } else if (ev.key=== 'Escape') {
      sModal.hide()
    }
  }

</script>

<div class:invisible={!$sModal.visible}
     class="absolute left-0 top-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">

    <div use:clickOutside
         on:outclick={() => sModal.hide()}
         class="modal shadow-md bg-white rounded-md rounded-sm">
      <div class="flex flex-col w-full">
        <div class="w-full text-center bg-gray-300">
          {$sModal.options.title}
        </div>
        <input type="text"
               bind:this={inputEl}
               on:keyup={onKeyUp}
               placeholder="{$sModal.options.placeholder}"
               class="border outline-none w-full px-2"
               bind:value={$sModal.value}
        />
      </div>
    </div>
</div>

<style lang="scss">
  .modal {
    width: 400px;
  }
</style>
