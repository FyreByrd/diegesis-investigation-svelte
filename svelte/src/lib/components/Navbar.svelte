<script>
    import { nextDocSet, nextBook, nextChapter, numVerses } from '../data/stores';
    import { goto, prefetch } from '$app/navigation';
    import { queryPk } from '$lib/scripts/queryPk';

    let docPromise = queryPk(`{
        docSets {
            id
        }
    }`);
    $: bookPromise = queryPk(`{
        docSet(id: "`+$nextDocSet+`") {
            documents {
                bookCode:header(id: "bookCode")
            }
        }
    }`);
    $: chapPromise = queryPk(`{
        docSet(id:"`+$nextDocSet+`"){
            document(bookCode:"`+$nextBook+`"){
                cIndexes {
                    chapter
                }
            }
        }
    }`);

    function handleClick() {
        const link = "/read/"+$nextDocSet+"/"+$nextBook+"/"+$nextChapter+"#"+nextVerse;
        prefetch(link);
        goto(link);
    }

    let nextVerse = 1;

    //$: console.log($nextDocSet+" "+$nextBook+" "+$nextChapter);
</script>

<label for="docSet">Translation:</label>
{#await docPromise}
	<span>loading...</span>
{:then data}
    <select id="docSet" name="docSet" bind:value={$nextDocSet}>
        {#each JSON.parse(data).data.docSets as doc}
            <option value="{doc.id}">{doc.id}</option>
        {/each}
    </select>
{:catch error}
	<pre style="color: red">{error.message}</pre>
{/await}

<label for="book">Book:</label>
{#await bookPromise}
	<span>loading...</span>
{:then data}
    <select id="book" name="book" bind:value={$nextBook}>
        {#each JSON.parse(data).data.docSet.documents as b}
            <option value="{b.bookCode}">{b.bookCode}</option>
        {/each}
    </select>
{:catch error}
	<pre style="color: red">{error.message}</pre>
{/await}

<label for="chapter">Chapter:</label>
{#await chapPromise}
	<span>loading...</span>
{:then data}
    <select id="chapter" name="chapter" bind:value={$nextChapter}>
        {#each JSON.parse(data).data.docSet.document.cIndexes as c}
            <option value="{""+c.chapter}">
                {c.chapter}
            </option>
        {/each}
    </select>
{:catch error}
	<pre style="color: red">{error.message}</pre>
{/await}

<label for="verse">Verse:</label>
<select id="verse" name="verse" bind:value={nextVerse}>
    {#each Array($numVerses) as _, i}
        <option value="{i+1}">
            {i+1}
        </option>
    {/each}
</select>

<button on:click={handleClick}>submit</button>
