import { docSetStore, bookStore, chapterStore } from './reference-stores';
import { derived } from 'svelte/store';
import { queryPk } from '../scripts/queryPk';

export const docSet = docSetStore();
export const book = bookStore(docSet);
export const chapter = chapterStore(docSet, book);

export const nextDocSet = docSetStore();
export const nextBook = bookStore(nextDocSet);
export const nextChapter = chapterStore(nextDocSet, nextBook);

export const numVerses = derived(
    [docSet, book, chapter],
    ([$docSet, $book, $chapter], set) => {
        queryPk(`{
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
    queryPk(`{
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
});
