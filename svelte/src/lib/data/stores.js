import { pkStore } from './pkstore';
import { writable, derived } from 'svelte/store';

export const pk = pkStore();
export const docSet = (() => {
    const internal = writable("");
    const external = derived(internal, ($internal, set) => {
        pk.query(`{
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
})();
export const book = (() => {
    const internal = writable("");
    const external = derived([internal, docSet], ([$internal, $docSet], set) => {
        pk.query(`{
            docSet(id: "`+$docSet+`") {
                documents {
                    bookCode: header(id: "bookCode")
                }
                document(bookCode: "`+$internal+`") {
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
})();
export const chapter = (() => {
    const internal = writable("");
    const external = derived([internal, docSet, book], ([$internal, $docSet, $book], set) => {
        const setDefault = () => {
            $internal = "1";
            set("1");
        }
        
        if($internal === "") {
            setDefault();
        } else {
            pk.query(`{
                docSet(id: "`+$docSet+`") { 
                    document(bookCode: "`+$book+`") {
                        cIndex(chapter: `+$internal+`) {
                            text
                        }
                    }
                }
            }`,
            r => {
                try {
                    const cExists = JSON.parse(r).data.docSet.document.cIndex.text !== "";
                    if(cExists) { set($internal) } else { setDefault(); }
                } catch (err) {
                    if(!(err instanceof TypeError)) { throw err;}
                }
            });
        }
    })

    return { set: internal.set, subscribe: external.subscribe }
})();


export const numVerses = derived(
    [docSet, book, chapter],
    ([$docSet, $book, $chapter], set) => {
        pk.query(`{
            docSet(id: "`+$docSet+`") { 
                document(bookCode:"`+$book+`") {
                    cvIndex(chapter:`+$chapter+`) {
                        verseNumbers { number }
                    }
                }
            }
        }`, 
        r => {
            try {
                set(JSON.parse(r).data.docSet.document.cvIndex.verseNumbers.length);
            } catch (err) {
                if(!(err instanceof TypeError)) { throw err;}
            }
        });
    }
);
