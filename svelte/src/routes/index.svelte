<script>
    import { pk, docSet, book, chapter, defaultBook } from "$lib/data/stores.js";
    import Navbar from "$lib/components/Navbar.svelte";

    $: promise = pk.query(`{
            docSet(id: "`+$docSet+`") {
                documents {
                    bookCode: header(id: "bookCode")
                } 
                document(bookCode:"`+$book+`") {
                    bookCode: header(id: "bookCode")
                    cv(chapterVerses:"`+$chapter+`:1", includeContext: true) {
                        text
                    }
                }
            }
        }`);

</script>

<Navbar/>

<p>query:</p>
{#await promise}
	<p>...waiting</p>
{:then data}
    <pre>{data}</pre>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

<pre>
{$defaultBook}
</pre>