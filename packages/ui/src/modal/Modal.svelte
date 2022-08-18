<script>
  import {clickOutside} from "../util";


  /** @type {import('../typedef').Modal} */
  export let sModal;
</script>

<div class:invisible={!$sModal.visible}
     class="absolute left-0 top-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">

    <div use:clickOutside
         on:outclick={() => sModal.hide()}
         class="modal shadow-md bg-white rounded-md rounded-sm"
         {...$$restProps}>

      <slot></slot>
    </div>
</div>

<style lang="scss">
  .modal {
    width: 400px;
  }
</style>
