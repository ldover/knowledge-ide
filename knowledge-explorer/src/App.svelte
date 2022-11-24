<script>
  import Reader from "./routes/reader/Reader.svelte";
  import Footer from "./components/Footer.svelte";

  let index = [
    {
      repository: 'https://github.com/ldover/knowledge-systems',
      title: 'Scaling Civilizational Knowledge',
      author: 'Luka Dover',
      description: "We have perfected our information systems, and yet as civilization we seem more prone to ignorance than ever. In this article we address this dichotomy and use principles from Austrian economics to begin sketching out a conceptual framework for understanding knowledge systems, so that in the future we may learn to design large-scale knowledge systems that render more value to individuals and minimize our collective ignorance.",
      date: '22 Oct 2022',
      version: 'v0.0.2'
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
  <div class="w-full h-full flex flex-col items-center text-gray-900 min-h-screen">
    <div class="w-full hero flex flex-col items-start md:items-center  px-8 py-6 md:py-16">
      <a href="https://github.com/ldover/knowledge-ide"
         target="_blank"
         class="absolute top-0 right-0 m-4"
      >
        <img src="./assets/GitHub-Mark-Light-120px-plus.png"
             width="40px"
        />
      </a>
      <div class="content text-white text-lg font-normal">
        <h1 class="text-3xl mb-4 font-medium">
          Knowledge Index
        </h1>
        <div class="mb-4 text-gray-200">

        </div>

        <div class="text-gray-200">
          This is an experiment to see if we can write articles like software, publish them on GitHub like software libraries, and access them with open-source UIs like this one.
        </div>
        <div class="mt-3">
          To learn more, see the project on
          <a class="text-sky-400 hover:underline mt-3"
             target="_blank"
             href="https://github.com/ldover/knowledge-ide">GitHub</a>.
        </div>
      </div>
    </div>

    <div class="flex flex-col justify-start items-start mt-8 mb-16 px-8 md:p-0 content flex-grow">
      <div class="font-bold text-gray-500 mb-3">ARTICLES</div>
      <div class="font-light text-gray-600 text-sm mb-4">Note: this is an early a proof of concept and more articles will be added to the index as it develops…</div>

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
