<script>
    export let banner;

    $: formattedMessage = `[${banner.type.toUpperCase()}]: ${banner.message}${banner.loc ? `(${banner.loc.line}:${banner.loc.column})` : ''}`
</script>


<div class="banner"
     class:error={banner.type === 'error'}
>
    {formattedMessage}
</div>

<style lang="scss">
    .banner {
      @apply flex p-3 w-full text-sm;
    }

    .banner.error {
      @apply bg-red-600 text-white;
    }
</style>
