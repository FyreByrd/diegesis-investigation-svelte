import { pkStore } from './pkstore';
import { docSetStore, bookStore, chapterStore } from './reference-stores';
import { derived } from 'svelte/store';

export const pk = pkStore();

export const docSet = docSetStore(pk);
export const book = bookStore(pk, docSet);
export const chapter = chapterStore(pk, docSet, book);

export const nextDocSet = docSetStore(pk);
export const nextBook = bookStore(pk, nextDocSet);
export const nextChapter = chapterStore(pk, nextDocSet, nextBook);

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
