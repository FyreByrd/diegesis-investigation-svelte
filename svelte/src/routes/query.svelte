<script>
    import {pk,docSet,book,chapter, numVerses} from '$lib/data/stores';
    import { get } from 'svelte/store'
    import { ScriptureParaModelQuery } from "proskomma-render";
    let ds = "eng_web"
    let b = "JHN"
    let cv = "1:1-10"
    //$: promise = ScriptureParaModelQuery($pk, [ds], [b])
    $: promise = pk.query(`{
        docSet (id: "${ds}"){
            id
            selectors { key value }
            tags
            document (bookCode: "${b}"){
              id
              headers { key value }
              idParts { type parts }
              tags
              sequences {
                id
                type
                blocks {
                  bs { payload }
                  bg { subType payload }
                  items { type subType payload }
                }
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