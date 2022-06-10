<script>
    import { pk, docSet, book, chapter} from '../data/stores';
    import { goto } from '$app/navigation';

    $: next = {d:$docSet,b:$book,c:$chapter}

    let docPromise = pk.query(`{
        docSets {
            id
        }
    }`);
    $: bookPromise = pk.query(`{
        docSet(id: "`+next.d+`") {
            documents {
                bookCode:header(id: "bookCode")
            }
        }
    }`);
    $: chapPromise = pk.query(`{
        docSet(id:"`+next.d+`"){
            document(bookCode:"`+next.b+`"){
                cIndexes {
                    chapter
                }
            }
        }
    }`);

    function handleClick() {
        goto("/read/"+next.d+"/"+next.b+"/"+next.c);
    }

</script>

<label for="docSet">Translation:</label>
{#await docPromise}
	<span>loading...</span>
{:then data}
    <select id="docSet" name="docSet" bind:value={next.d}>
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
    <select id="book" name="book" bind:value={next.b}>
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
    <select id="chapter" name="chapter" bind:value={next.c}>
        {#each JSON.parse(data).data.docSet.document.cIndexes as c}
            <option value="{""+c.chapter}">
                {c.chapter}
            </option>
        {/each}
    </select>
{:catch error}
	<pre style="color: red">{error.message}</pre>
{/await}

<button on:click={handleClick}>submit</button>
