<script>
    import { pk, docSet, book, chapter, defaultBook, numVerses } from "$lib/data/stores.js";

    $: promise = pk.query(`{
            docSet(id: "`+$docSet+`") {
                documents {
                    bookCode: header(id: "bookCode")
                } 
                document(bookCode:"`+$book+`") {
                    bookCode: header(id: "bookCode")
                    cv(chapterVerses:"`+$chapter+`:1-`+$numVerses+`", includeContext: true) {
                        scopeLabels(startsWith: "verse")
                        text
                    }
                }
            }
        }`);

</script>

<p>query:</p>
{#await promise}
	<p>...waiting</p>
{:then data}
    <pre>{data}</pre>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

<pre>{$defaultBook}</pre>
<pre>{$numVerses}</pre>