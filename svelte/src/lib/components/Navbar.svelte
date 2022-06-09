<script>
    import { pk, docSet, book, chapter, defaultBook } from '../data/stores';

    let docPromise = pk.query(`{
        docSets {
            id
        }
    }`);
    $: bookPromise = pk.query(`{
        docSet(id: "`+$docSet+`") {
            documents {
                bookCode:header(id: "bookCode")
            }
        }
    }`);
    $: chapPromise = pk.query(`{
        docSet(id:"`+$docSet+`"){
            document(bookCode:"`+$book+`"){
                cIndexes {
                    chapter
                }
            }
        }
    }`);
</script>

<label for="docSet">Translation:</label>
{#await docPromise}
	<span>loading...</span>
{:then data}
    <select id="docSet" name="docSet" bind:value={$docSet}>
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
    <select id="book" name="book" bind:value={$book}>
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
    <select id="chapter" name="chapter" bind:value={$chapter}>
        {#each JSON.parse(data).data.docSet.document.cIndexes as c}
            <option value="{c.chapter}">{c.chapter}</option>
        {/each}
    </select>
{:catch error}
	<pre style="color: red">{error.message}</pre>
{/await}

<h1>{$docSet}: {$book} {$chapter}</h1>