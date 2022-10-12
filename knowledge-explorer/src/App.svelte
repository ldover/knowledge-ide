<script>
  import Reader from "./routes/reader/Reader.svelte";

  let index = [
    {
      repository: 'https://gitlab.com/ldover/knowledge-engineering.git',
      title: 'Scaling Civilizational Knowledge',
      author: 'Luka Dover',
      description: 'Exploration of the first principles scaling knowledge systems',
      date: '12 Oct 2022',
    }
  ]

  let view;
  onHashChange();

  function onHashChange(e) {
    view = window.location.hash.substring(2).split('?')[0];
  }
</script>

<svelte:window on:hashchange={onHashChange}/>

{#if !view}
  <div class="w-full h-full flex flex-col items-center text-gray-900">
    <div class="h-16 w-full bg-indigo-500 hero flex flex-col items-start md:items-center justify-center px-8">
<!--      <a href="/" class="merriweather text-gray-100 m-3 py-4">Menu</a>-->
      <div class="content">
        <div class="text-xs mb-4 text-2xl text-white uppercase">Knowledge as Software</div>
        <div class="text-lg text-xs mb-4 text-white">An experiment in knowledge engineering, developing articles like software, publishing them on GitHub.</div>
        <a class="text-sky-200 text-xs">About this project</a>
      </div>
<!--      <div class=""><a></a></div>-->
<!--      <div class="text-xs mb-4 text-xl text-white uppercase">GitHub</div>-->
    </div>

    <div class="flex flex-col justify-center items-start mt-8 px-8 md:p-0 content">
      <div class="font-bold text-gray-500 mb-4">ARTICLES</div>

      {#each index as article}
        <div class="border border-black border-indigo-500 w-full">
          <div class="p-4 pb-2 bg-black text-white">
              <a class="text-sky-400 underline" href="#/reader?repository={encodeURIComponent(article.repository)}">{article.title}</a>
              <div class="text-white-gray-200 font-light italic">
                {article.author}
              </div>
            <div class="text-gray-300 font-light italic">
              {article.date}
            </div>
          </div>
          <div class="p-4 text-gray-900">
            {article.description}
          </div>
        </div>
      {/each}
    </div>
  </div>
{:else if view === 'reader'}
  <Reader/>
{:else}
  <div>Weird link, try going to main menu:</div>
{/if}

<style lang="scss">
  .content {
    width: 100%;
    max-width: 600px;
  }

  .hero {
    @apply bg-black h-1/3;
  }
</style>
