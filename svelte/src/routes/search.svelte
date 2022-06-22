<script>
    import { queryPk } from '$lib/scripts/queryPk';

    export const searchTerms = (text) => (
        text.split(/ +/)
            .map((term) => term.trim())
            .filter((term) => term.length > 0)
            .filter(term => !term.includes(':'))
    );

    export const searchTermsClause = (text) => (
        searchTerms(text)
            .map(st => `"${st.toLowerCase()}"`).join(', ')
    );

    export const attTermsClause = (text) => (
        text.split(/ +/)
            .map((term) => term.trim())
            .filter((term) => term.length > 0)
            .filter(term => term.includes(':'))
            .map(term => term.split(':').slice(0, 2))
            .map(st => {
            const isMilestone = st[0].startsWith('x-');
            const attribute = isMilestone ? 'milestone' : 'spanWithAtts';
            const marker = isMilestone ? 'zaln' : 'w';
            return `"""attribute/${attribute}/${marker}/${st[0]}/0/${st[1]}"""`;
            }).join(', ')
    );

    export const searchTermsRegex = (text) => {
        const _searchTerms = searchTerms(text);
        let regex = 'xxxxx';

        if (_searchTerms.length > 0) {
            regex = _searchTerms.map(st => `(${st})`).join('|');
        };
        return regex;
    };

    export const searchForPassagesQuery = ({text, docSetId, bookCode, blocks = false, tokens = false,}) => {
        const _searchTermsClause = searchTermsClause(text);
        const _attTermsClause = attTermsClause(text);
        const _searchTermsRegex = searchTermsRegex(text);

        const _tokensClause = tokens ? `tokens {
                    subType
                    payload
                    scopes(
                        startsWith:[
                        "attribute/spanWithAtts/w/"
                        "attribute/milestone/zaln/"
                        ]
                    )
                    }
        `: '';

        const _blocksClause = `mainSequence {
                blocks(
                allChars : true
                withMatchingChars: [${_searchTermsClause}]
                withScopes: [${_attTermsClause}]
                ) {
                scopeLabels(startsWith:["chapter/", "verse/"])
                itemGroups(byScopes:["chapter/", "verses/"]) {
                    scopeLabels(startsWith:["verses/"])
                    text
                    ${_tokensClause}          }
                }
            }`;

        const _versesClause = `cvMatching(
                allChars : true
                allScopes : true
                withMatchingChars: [${_searchTermsClause}]
                withScopes: [${_attTermsClause}]
            ) {
                scopeLabels(startsWith:["chapter/", "verse/"])
                text
                ${_tokensClause}      }`;

        const _blocksOrVersesClause = blocks ? _blocksClause : _versesClause;

        const blockMatchQuery = (
            `{
        docSet(id:"${docSetId}") {
            id
            document(
            bookCode:"${bookCode?.toUpperCase()}" 
            ) {
            id
            bookCode: header(id: "bookCode")
            ${_blocksOrVersesClause}
            }
            matches: enumRegexIndexesForString (enumType:"wordLike" searchRegex:"${_searchTermsRegex}") { matched }
        }
        }`
        );
        return blockMatchQuery;
    };

    function handleClick() {
        query = searchForPassagesQuery({
            text: searchText, 
            docSetId:"eng_web",
            bookCode:"JHN",
            
        });
    }
    let searchText = "";
    let query = "";
    $: promise = (() => { if(query !== "") return queryPk(query)})();
</script>

<input type="text" placeholder="Enter your search here" bind:value={searchText}/>
<button on:click={handleClick}>search</button>

<pre>{query}</pre>

{#await promise}
    <pre>waiting...</pre>
{:then data}
    {#if data !== undefined}
        <pre>{data}</pre>
    {/if}
{:catch err}
    <pre style="color:red;">{err.message}</pre>
{/await}

