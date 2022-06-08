<script>
    import { pk, test } from "$lib/data/stores.js";

    const getData = async function() {
        console.log("index")
        const res = await pk.query(`{
            docSets { 
                id
                documents {
                    bookCode: header(id: "bookCode")
                }
            }
        }`);
        let j = JSON.stringify(res, null, 2);
        console.log("getdata")
        console.log(j);
        return j;
    }
    let promise = getData();


</script>

{#await promise}
	<p>...waiting</p>
{:then data}
	<pre>{data}</pre>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
<p>{$test}</p>