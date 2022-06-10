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
export const book = writable("");
export const chapter = writable("");

export const book2 = (() => {
    const internal = writable("");
    const external = writable("a");

    return { set: internal.set, subscribe: external.subscribe }
})();

export const chapter2 = (() => {
    const internal = writable("");
    const external = writable("a");

    return { set: internal.set, subscribe: external.subscribe }
})();

/*
const defaults = derived(
    [docSet, book, chapter],
    ([$docSet, $book, $chapter]) => {
        console.log("docSet: "+$docSet)
        if($docSet === "") {
            pk.query(`{
                docSets {
                    id
                }
            }`, 
            r => {
                $docSet = JSON.parse(r).data.docSets[0]
            });
        }
    }
);*/

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
