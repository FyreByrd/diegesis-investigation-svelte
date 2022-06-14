<script>
    import { page } from '$app/stores';
    import { pk, docSet, book, chapter, numVerses, bookTitle } from '$lib/data/stores';

    $: (() => {
        const r = $page.params.reference.split("/");
        if(r.length > 0) {
            $docSet = r[0];
        }
        if(r.length > 1) {
            $book = r[1];
        }
        if(r.length > 2) {
            $chapter = r[2];
        }
        if(r.length > 3) {
            
        }
    })();

    $: promise = pk.query(`{
        docSet(id:"${$docSet}") {
            document(bookCode: "${$book}") {
                title: header(id: "toc2")
                mainSequence {
                    blocks(withScriptureCV: "${$chapter}") {
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
	<p>...waiting</p>
{:then data}
    <h1>{JSON.parse(data).data.docSet.document.title}</h1>
    <h2>Chapter: {$chapter}</h2>
    {@html renderChapter(data)}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}