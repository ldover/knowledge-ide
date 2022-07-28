<script>
    export let banner;

    const formatLocation = (loc) => {
      if (!loc) return '';
      if (typeof loc.start === 'number') {
        return ` (position ${loc.start}:${loc.end})`;
      } else if (typeof loc.start === "object" && typeof loc.start.line === "number") {
        return ` (line ${loc.start.line}, column ${loc.start.column})`
      }

      return '';
    }
    $: formattedMessage = `[${banner.type.toUpperCase()}]: ${banner.message}${formatLocation(banner.loc)}`

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
