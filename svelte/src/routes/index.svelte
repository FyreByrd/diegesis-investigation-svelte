<script>
    import { pk } from "$lib/data/stores.js";
    
    const queryPk = async function (query, callback) {
        const result = await $pk.gqlQuery(query);
        callback(result);
    }

    const getData = function(json) {
        res = JSON.stringify(json, null, 2);
    }
    let res;
    $: data = res;
</script>

<pre>
{data}
</pre>