<script>
    import { page } from '$app/stores';
    import { pk, docSet, book, chapter, numVerses, bookTitle } from '$lib/data/stores';

    $: (() => {
        const r = $page.params.reference.split("/");
        if(r.length > 0) {
            $docSet = r[0];
        }
        if(r.length > 1) {
            $book = r[1];
        }
        if(r.length > 2) {
            $chapter = r[2];
        }
        if(r.length > 3) {
            
        }
    })();

    $: promise = pk.query(`{
        docSet(id: "`+$docSet+`") {
            document(bookCode:"`+$book+`") {
                cv(chapterVerses:"`+$chapter+`:1-`+$numVerses+`", includeContext: true) {
                    text
                }
            }
        }
    }`);
</script>

<!--<pre>{JSON.stringify($page.params, null, 2)}</pre>
<pre>{"reference: ["+ref+"]"}</pre>-->

<h1>{$bookTitle}</h1>
<h2>Chapter {$chapter}</h2>
{#await promise}
	<p>...waiting</p>
{:then data}
    {#each JSON.parse(data).data.docSet.document.cv as v, i}
        <p id="{""+(i+1)}"><em>{i+1}</em> {v.text}</p>
    {/each}
    <pre>{data}</pre>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}