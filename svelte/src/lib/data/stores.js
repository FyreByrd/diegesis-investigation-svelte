import { pkStore } from './pkstore';
import { writable, derived } from 'svelte/store';

export const pk = pkStore();
export const docSet = writable("eng_web");
export const book = writable("JHN");
export const chapter = writable(1);

export const defaultBook = derived(
    docSet,
    ($docSet, set) => {
        pk.query(`{
            docSet(id: "`+$docSet+`") {
                documents {
                    bookCode:header(id: "bookCode")
                }
            }
        }`, 
        r => {
            set(JSON.parse(r).data.docSet.documents[0].bookCode)
        });
    }
);
