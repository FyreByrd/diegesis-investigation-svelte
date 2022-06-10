<script>
    import {pk,docSet,book,chapter} from '$lib/data/stores';
    $: promise = pk.query(`{
            docSet(id: "eng_web") { 
                document(bookCode: "JHN") {
                    cIndex(chapter: 22) {
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
<pre>{$book}</pre>