<script>
  export let node;

</script>

<div class="note">
    <slot></slot>
</div>

<style>
    .note {
        @apply font-light;
        font-family: 'Roboto', sans-serif;
    }
</style>