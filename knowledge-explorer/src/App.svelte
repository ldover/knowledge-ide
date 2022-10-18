<script>
  import Reader from "./routes/reader/Reader.svelte";

  let index = [
    {
      repository: 'https://gitlab.com/ldover/knowledge-engineering.git',
      title: 'Scaling Civilizational Knowledge',
      author: 'Luka Dover',
      description: "We have perfected our information systems, and yet as civilization we seem more prone suffer from ignorance than ever. " +
        "In this article we use principles from Austrian economics to develop a conceptual framework for understanding knowledge systems and how to guide their development towards rendering us more useful service as individuals and as civilization.",
      date: '18 Oct 2022',
      version: 'v0.0.1'
    }
  ]

  let view;
  let article;
  onHashChange();

  function onHashChange(e) {
    view = window.location.hash.substring(2).split('?')[0];
  }
</script>

<svelte:window on:hashchange={onHashChange}/>

{#if !view}
  <div class="w-full h-full flex flex-col items-center text-gray-900">
    <div class="w-full hero flex flex-col items-start md:items-center  px-8 py-6 md:py-16">
      <div class="content text-white text-lg font-normal">
        <h1 class="text-2xl mb-4 font-medium">
          Knowledge index
        </h1>
        <div class="mb-4 text-gray-200">
          This experiment is testing whether we could use practices from software engineering to write and publish articles as software libraries.
        </div>

        <div class="text-gray-200">
          Articles are published on GitHub and can be read using this tool.
        </div>
      </div>
    </div>

    <div class="flex flex-col justify-center items-start mt-8 px-8 md:p-0 content">
      <div class="font-bold text-gray-500 mb-3">ARTICLES</div>
      <div class="font-light text-gray-600 text-sm mb-4">Note: this is an early a proof of concept and more articles will be added as it develops…</div>

      {#each index as article}
        <div class="border border-black w-full">
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
  <Reader article={index[0]}/>
{:else}
  <div>Weird link, try going to main menu:</div>
{/if}

<style lang="scss">
  nav > a {

  }
  .content {
    width: 100%;
    max-width: 600px;
  }

  .hero {
    @apply bg-black;
  }
</style>
