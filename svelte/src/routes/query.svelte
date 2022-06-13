<script>
    import {pk,docSet,book,chapter, numVerses} from '$lib/data/stores';
    $: promise = pk.query(`{
        docSet(id: "`+$docSet+`") {
            document(bookCode: "`+$book+`") {
                cv(chapterVerses:"1") {
                    text
                }
            }
        }
    }`);
</script>

{#await promise}
    <pre>waiting...</pre>
{:then data}
    <pre>{data}</pre>
{:catch err}
    <pre style="color:red;">{err.message}</pre>
{/await}