<script>
  import {clickOutside} from "./util";
  import {sContextMenu} from "./context-menu/store";
  import {sFileSystem} from "./store";

  const options = [
    {
      name: 'New',
      onClick: () => {
        sContextMenu.onNew();
      }
    },
    {
      name: 'Rename',
      onClick: () => console.log('Rename')
    },

    {
      name: 'Delete',
      onClick: () => sContextMenu.onDelete()
    }
  ]

  $: style = $sContextMenu.visible ? `left: ${$sContextMenu.left}px;top: ${$sContextMenu.top}px;` : '';
</script>

<div id="context-menu"
     style="{style}"
     class:invisible={!$sContextMenu.visible}
     bind:this={$sContextMenu.el}
     use:clickOutside
     on:outclick={() => sContextMenu.hide()}
>
    {#each options as option}
        <div class="item" on:click={() => option.onClick()}>{option.name}</div>
    {/each}
</div>

<style lang="scss">
  #context-menu {
    @apply fixed z-50 bg-white rounded-md shadow-md;
    width: 150px;
  }

  #context-menu .item {
    @apply p-2 text-sm cursor-pointer;
  }

  #context-menu .item:hover {
    @apply bg-gray-100;
  }
</style>
