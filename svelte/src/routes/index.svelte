<script>
    import { pk } from "$lib/data/stores.js";

    const getData = async function() {
        const res = await pk.query(`{
            docSets { 
                id
                documents {
                    bookCode: header(id: "bookCode")
                }
            }
        }`);
        return res;
    }
    let promise = getData();


</script>

<p>query:</p>
{#await promise}
	<p>...waiting</p>
{:then data}
	<pre>{JSON.stringify(data, null, 2)}</pre>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}