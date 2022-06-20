<script>
    import {clickOutside} from "./util";

    const options = [
      {
        name: 'New',
        onClick: () => console.log('new')
      },
      {
        name: 'Rename',
        onClick: () => console.log('Rename')
      },

      {
        name: 'Delete',
        onClick: () => console.log('Delete')
      }
    ]

    let el;
    export let visible;
</script>

<div id="context-menu"
     class:invisible={!visible}
     bind:this={el}
     use:clickOutside
     on:outclick={() => {console.log('invisible');visible = false}}
>
    {#each options as option}
        <div class="item">{option.name}</div>
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
