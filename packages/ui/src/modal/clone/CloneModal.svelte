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
               placeholder="github/repo/project.git"
               class="border outline-none w-full px-2"
               bind:value={$sModal.url}
        />
      </div>
      <div>
        <div>Directory</div>
        <input type="text"
               placeholder="~/Projects/project-name"
               class="border outline-none w-full px-2"
               bind:value={$sModal.dir}
        />
      </div>
      <div class="w-full flex justify-end mt-2">
        <button on:click={() => sModal.clone()}
                class="bg-teal-700 text-white px-4 rounded-sm">Clone</button>
      </div>
    </div>
  </div>
</Modal>
