<script>
    import {docSet,book,chapter, numVerses} from '$lib/data/stores';
    import {queryPk} from '$lib/scripts/queryPk';
    import {preQueries, queries, postQueries} from 'proskomma-tools';

    let ds = "eng_web"
    let b = "GRK"
    let c = "1"
    let v = "1-10"
    
    let ref = {
        ds: ds,
        b: b,
        c: c,
        v: v
    }
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
            docSets { id }
            docSet(id: "${ds}") {
                books: documents { bookCode: header(id: "bookCode") }
                book: document(bookCode:"${b}") {
                    chapter: cIndex(chapter: ${c}) {
                        text
                    }
                    verses: cvIndex(chapter:${c}) {
                        numbers: verseNumbers { number }
                    }
                }
            }
        }`,
        r => {
            let newRef = ref
            const o = JSON.parse(r).data
            if(o.docSet === null) {
                newRef.ds = o.docSets[0].id
            }
            else {
                newRef.ds = o.docSet
                if(o.docSet.book === null) {

                }
            }
            
            //ref = newRef
        });
    
    $: cat = queryPk(queries.catalogQuery({cv: false}))
</script>

{#await promise}
    <pre>waiting...</pre>
{:then data}
    <!--{(console.log(data),'')}-->
    <pre>{data}</pre>
{:catch err}
    <pre style="color:red;">{err.message}</pre>
{/await}
<pre>{JSON.stringify(ref, null, 2)}</pre>

{#await cat}
    <pre>waiting...</pre>
{:then data}
    <!--{(console.log(data),'')}-->
    <pre>{JSON.stringify(postQueries.parseChapterVerseMapInDocSets(
            {docSets:JSON.parse(data).data.docSets}), null, 2)}</pre>
{:catch err}
    <pre style="color:red;">{err.message}</pre>
{/await}