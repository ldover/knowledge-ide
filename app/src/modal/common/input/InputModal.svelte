<script>
  import {afterUpdate} from 'svelte';
  import Modal from "../../Modal.svelte";

  /** @type {import('../../../typedef').Modal} */
  export let sModal;

  function onKeyUp(ev) {
    if (ev.key === 'Enter') {
      sModal.submit()
    } else if (ev.key === 'Escape') {
      sModal.hide()
    }
  }
</script>

<Modal {sModal}>
  <div class="flex flex-col w-full">
    <div class="w-full text-center bg-gray-300">
      {$sModal.options.title}
    </div>
    <input type="text"
           bind:this={$sModal.inputEl}
           on:keyup={onKeyUp}
           placeholder="{$sModal.options.placeholder}"
           class="border outline-none w-full px-2"
           bind:value={$sModal.value}
    />
  </div>
</Modal>

