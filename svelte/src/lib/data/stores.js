import { pkStore } from './pkstore';
import { writable, derived } from 'svelte/store';

export const pk = pkStore();
export const docSet = (() => {
    const internal = writable("");
    const external = derived(internal, ($internal, set) => {
        if($internal === "") {
            pk.query(`{
                docSets {
                    id
                }
            }`, 
            r => {
                set(JSON.parse(r).data.docSets[0].id);
            }); 
        } else { set($internal)}
    })

    return { set: internal.set, subscribe: external.subscribe }
})();
export const book = (() => {
    const internal = writable("");
    const external = derived([internal, docSet], ([$internal, $docSet], set) => {
        const setDefault = () => {
            pk.query(`{
                docSet(id: "`+$docSet+`") {
                    documents {
                        bookCode: header(id: "bookCode")
                    }
                }
            }`, 
            r => {
                try{
                    const b = JSON.parse(r).data.docSet.documents[0].bookCode;
                    internal.set(b);
                    set(b);
                } catch (err) {
                    if(!(err instanceof TypeError)) { throw err;}
                }
            });
        }
        
        if($internal === "") {
            setDefault();
        } else {
            pk.query(`{
                docSet(id: "`+$docSet+`") { 
                    document(bookCode: "`+$internal+`") {
                        bookCode: header(id: "bookCode")
                    }
                }
            }`,
            r => {
                try { 
                    const dExists = JSON.parse(r).data.docSet.document !== null;
                    if(dExists) { set($internal) } else { setDefault(); }
                } catch (err) {
                    if(!(err instanceof TypeError)) { throw err;}
                }
            });
        }
    })

    return { set: internal.set, subscribe: external.subscribe }
})();
export const chapter = (() => {
    const internal = writable(0);
    const external = derived([internal, docSet, book], ([$internal, $docSet, $book], set) => {
        const setDefault = () => {
            internal.set(1);
            set(1);
        }
        
        if($internal === 0) {
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
            set(JSON.parse(r).data.docSet.document.cvIndex.verseNumbers.length)
        });
    }
);
