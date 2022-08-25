<script>
  import {clickOutside} from "../util";


  /** @type {import('../typedef').Modal} */
  export let sModal;

  export let closeOnOutClick = true;
</script>

<div class:invisible={!$sModal.visible}
     class="absolute left-0 top-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75">

    <div use:clickOutside
         on:outclick={() => closeOnOutClick && sModal.hide()}
         class="modal shadow-md bg-white"
         {...$$restProps}>

      <slot></slot>
    </div>
</div>

<style lang="scss">
  .modal {
    width: 400px;
  }
</style>
