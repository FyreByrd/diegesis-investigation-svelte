<script>
    import {docSet,book,chapter, numVerses} from '$lib/data/stores';
    import {queryPk} from '$lib/scripts/queryPk';

    let ds = "eng_web"
    let b = "JHN"
    let cv = "1:1-10"
    
    /*$: promise = pk.query(`{
        docSet (id: "${ds}") {
            id
            selectors { key value }
            tags
            document (bookCode: "${b}") {
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
    }`);*/

    /*$: promise = pk.query(`{
        book: document(docSetId: "${ds}" withBook: "${b}") {
            title: header(id: "toc2")
            mainSequence {
                blocks(withScriptureCV: "${cv}") {
                    items { type subType payload}
                }
            }
        }
    }`);*/

    $: promise = queryPk(`{
        book: document(docSetId: "${ds}" withBook: "${b}") {
            title: header(id: "toc2")
            mainSequence {
                blocks(withScriptureCV: "${cv}") {
                    items { type subType payload}
                }
            }
        }
    }`);
</script>

{#await promise}
    <pre>waiting...</pre>
{:then data}
    <!--{(console.log(data),'')}-->
    <pre>{data}</pre>
{:catch err}
    <pre style="color:red;">{err.message}</pre>
{/await}