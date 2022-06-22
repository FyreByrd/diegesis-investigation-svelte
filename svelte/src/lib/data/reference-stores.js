import { writable, derived } from "svelte/store";
import { queryPk } from '../scripts/queryPk';
export const docSetStore = () => {
    const internal = writable("");
    const external = derived(internal, ($internal, set) => {
        queryPk(`{
            docSets {
                id
            }
        }`,
        r => {
            if($internal === "") {
                const ds = JSON.parse(r).data.docSets[0].id;
                $internal = ds;
                set(ds);
            } else { set($internal); }
        });
    })

    return { set: internal.set, subscribe: external.subscribe }
};

export const bookStore = (docSet) => {
    const internal = writable("");
    const external = derived([internal, docSet], ([$internal, $docSet], set) => {
        queryPk(`{
            docSet(id: "${$docSet}") {
                documents {
                    bookCode: header(id: "bookCode")
                }
                document(bookCode: "${$internal}") {
                    bookCode: header(id: "bookCode")
                }
            }
        }`, 
        r => {
            try{
                const b = JSON.parse(r).data.docSet.document;
                const firstBook = JSON.parse(r).data.docSet.documents[0].bookCode;
                if(b === null) {
                    $internal = firstBook;
                    set(firstBook);
                } else { 
                    $internal = b.bookCode;
                    set(b.bookCode);
                }
            } catch (err) {
                if(!(err instanceof TypeError)) { throw err;}
            }
        });
    })

    return { set: internal.set, subscribe: external.subscribe }
};

export const chapterStore = (docSet, book) => {
    const internal = writable("");
    const external = derived([internal, docSet, book], ([$internal, $docSet, $book], set) => {
        queryPk(`{
            docSet(id: "${$docSet}") { 
                document(bookCode: "${$book}") {
                    cIndex(chapter: ${$internal}) {
                        text
                    }
                }
            }
        }`, 
        r => {
            try {
                const cExists = JSON.parse(r).data.docSet.document.cIndex.text !== "";
                if(cExists) { 
                    set($internal) 
                } else { 
                    $internal = "1";
                    set($internal); 
                }
            } catch (err) {
                if(!(err instanceof TypeError)) { throw err;}
            }
        });
    })

    return { set: internal.set, subscribe: external.subscribe }
};
