<script>
    import {pk,docSet,book,chapter, numVerses} from '$lib/data/stores';
    
    let ds = "eng_web"
    let b = "JHN"
    let cv = "1"
    
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

    $: promise = pk.query(`{
        docSet(id:"${ds}") {
            document(bookCode: "${b}") {
                title: header(id: "toc2")
                tags
                sequences (types:"footnote"){
                    blocks {
                        bs { payload }
                        items { type subType payload }
                    }
                }
            }
        }
    }`);

    function renderChapter(data) {
        const blocks = JSON.parse(data).data.docSet.document.mainSequence.blocks;
        let rendered = "";
        for(let i = 0; i < blocks.length; i++)
            rendered += `<div class="${i === 0?"m":"p"}">${renderBlock(blocks[i])}</div>`
        return rendered;
    }

    function renderBlock(block) {
        let rendered = "";
        for(let i = 0; i < block.items.length; i++) {
            var item = block.items[i];
            if(item.type === "scope" && item.subType === "start") {
                var payload = item.payload.split("/")
                if(payload[0] === "verses") {
                    rendered += `<em id="${payload[1]}">${payload[1]}</em><span>&nbsp;</span>`
                } else {
                    //rendered += `<pre>--${item.type+":"+item.subType+" > "+payload}</pre>`
                }
            }else if(item.type === "token") {
                rendered += `${item.payload}`
            }
        }

        return rendered;
    }
</script>

{#await promise}
    <pre>waiting...</pre>
{:then data}
    <pre>{data}</pre>
{:catch err}
    <pre style="color:red;">{err.message}</pre>
{/await}