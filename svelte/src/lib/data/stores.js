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

export const bookTitle = derived([docSet, book], ([$docSet, $book], set) => {
    pk.query(`{
        docSet(id: "`+$docSet+`") {
            document(bookCode: "`+$book+`") {
                bookTitle: header(id: "toc")
            }
        }
    }`,
    r => {
        try {
            set(JSON.parse(r).data.docSet.document.bookTitle);
        } catch (err) {
            if(!(err instanceof TypeError)) { throw err;}
        }
    })
})

export const nextDocSet = (() => {
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
export const nextBook = (() => {
    const internal = writable("");
    const external = derived([internal, nextDocSet], ([$internal, $nextDocSet], set) => {
        pk.query(`{
            docSet(id: "`+$nextDocSet+`") {
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
export const nextChapter = (() => {
    const internal = writable("");
    const external = derived([internal, nextDocSet, nextBook], ([$internal, $nextDocSet, $nextBook], set) => {
        pk.query(`{
            docSet(id: "`+$nextDocSet+`") { 
                document(bookCode: "`+$nextBook+`") {
                    cIndex(chapter: `+$internal+`) {
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
})();
