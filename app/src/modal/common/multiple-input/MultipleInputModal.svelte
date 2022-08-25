<script>
  import Modal from "../../Modal.svelte";

  /** @type {import('../../../typedef').Modal} */
  export let sModal;
</script>

<Modal {sModal}>
  <div class="flex flex-col w-full">
    <div class="pl-2 w-full flex justify-between bg-gray-300">
      <div>{$sModal.options.title}</div>
      <button class="text-gray-900 flex items-center hover:bg-gray-200 px-2 text-sm"
              on:click={() => sModal.hide()}>
        <span class="material-symbols-sharp text-gray-900">close</span> Close
      </button>
    </div>
    <div class="w-full px-2 py-2">
      {#each $sModal.inputs as input, i}
        <label>
          {input.label}
          <input type="text"
                 bind:this={input.el}
                 placeholder="{input.placeholder}"
                 class="border outline-none w-full px-2"
                 bind:value={input.value}
          />
        </label>
      {/each}
    </div>
    <div class="flex w-full justify-end px-2 pb-2">
      <button
        class="bg-gray-700 text-white border rounded-sm px-8 mt-2 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
        on:click={() => sModal.submit()}>
        {$sModal.options.submitText}
      </button>
    </div>
  </div>
</Modal>
