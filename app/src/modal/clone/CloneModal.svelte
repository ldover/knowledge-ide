<script>
  import Modal from "../Modal.svelte";

  export let sModal;
</script>

<Modal {sModal}>
  <div class="flex flex-col w-full">
    <div class="w-full text-center bg-gray-300">
      Clone project
    </div>
    <div class="p-2">
      <div class="mb-2">
        <div>URL</div>
        <input type="text"
               placeholder="https://gitlab.com/ldover/knowledge-library.git"
               class="border outline-none w-full px-2"
               bind:value={$sModal.url}
        />
      </div>
      <div class="w-full flex justify-end mt-2">
        <button on:click={() => sModal.clone()}
                disabled={$sModal.cloning}
                class="bg-teal-700 text-white px-4 rounded-sm flex items-center">
          {#if $sModal.cloning}
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          {/if}
          Clone
        </button>
      </div>
    </div>
  </div>
</Modal>
