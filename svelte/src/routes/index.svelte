<script>
    import { pk } from "$lib/data/stores.js";

    const getData = async function() {
        const res = await $pk.query(`{
            docSets { 
                id
                documents {
                    bookCode: header(id: "bookCode")
                }
            }
        }`);
        return JSON.stringify(res, null, 2);
    }
    let promise = getData();
</script>

{#await promise}
<pre>
...waiting
</pre>
{:then data}
<pre>
{data}
</pre>
{:catch error}
<pre style="color: red">
{error.message}
</pre>
{/await}