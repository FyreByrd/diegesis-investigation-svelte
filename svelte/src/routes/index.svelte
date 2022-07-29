<script>
    import { queryPk } from '$lib/scripts/queryPk';

    $: promise = queryPk(`{
        docSet(id: "eng_lsv") {
            book: document(bookCode: "GEN") { 
                perf
            }
        }
    }`);
    const seps = '.?!:;,';
    let displayJSON = false;
    const chapter = '1';
</script>

{#await promise}
    <pre>loading . . .</pre>
{:then res}
    <input type="checkbox" bind:checked={displayJSON} />
    {#if displayJSON}
    <pre>{
        JSON.stringify((() => {
            const s = Object.values(JSON.parse(JSON.parse(res).data.docSet.book.perf
            ).sequences).filter(o => o.type === "main");
            console.log(s)
            return s;
        })()
        ,null,2)
    }</pre>
    {:else}
    {#each Object.values(JSON.parse(JSON.parse(res).data.docSet.book.perf
        ).sequences).filter(o => o.type === "main")[0].blocks as block}
        {#if block.type === "graft"}
            <pre>{JSON.stringify(JSON.parse(JSON.parse(res).data.docSet.book.perf
                ).sequences[block.target], null, 2)}</pre>
        {:else}
            <pre>{JSON.stringify(block, null, 2)}</pre>
        {/if}
    {/each}
    {/if}
{:catch err}
    <pre>{err}</pre>
{/await}