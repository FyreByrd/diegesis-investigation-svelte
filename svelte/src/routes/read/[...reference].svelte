<script>
    import { page } from '$app/stores';
    import { pk, docSet, book, chapter, numVerses } from '$lib/data/stores';
    import { goto } from '$app/navigation';

    //$docSet = $page.params.docSet;
    //$book = $page.params.book;
    //$chapter = $page.params.chapter;
    $: ref = (() => {
        const r = $page.params.reference.split("/");
        console.log(r);
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
        return r;
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

<pre>{JSON.stringify($page.params, null, 2)}</pre>
<pre>{"reference: ["+ref+"]"}</pre>

<p>query:</p>
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