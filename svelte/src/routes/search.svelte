<script>
    import { queryPk } from '$lib/scripts/queryPk';
    import { queries } from 'proskomma-tools';

    function handleClick() {
        /*query = queries.searchForPassagesQuery({
            text: searchText, 
            docSetId:"eng_web",
            bookCode:"JHN",
        });*/
        console.log(query);
    }
    let searchText = "";
    let query = "";
    $: promise = (() => { if(query !== "") return queryPk(query)})();
</script>

<input type="text" placeholder="Enter your search here" bind:value={searchText}/>
<button on:click={handleClick}>search</button>

<pre>{query}</pre>

{#await promise}
    <pre>waiting...</pre>
{:then data}
    {#if data !== undefined}
        <pre>{data}</pre>
    {/if}
{:catch err}
    <pre style="color:red;">{err.message}</pre>
{/await}

