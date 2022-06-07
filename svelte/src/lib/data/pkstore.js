import { Proskomma } from 'proskomma';
import { thaw } from 'proskomma-freeze';
import {eng_web_jhn} from './eng_web_jhn';


export function pkStore() {
    let _val = new Proskomma();
    const subs = [];
    thaw(_val, eng_web_jhn);

    const subscribe = (cb) => {
        subs.push(cb);
        cb(_val);
        
        return () => {
            const index = subs.findIndex((fn) => fn === cb);
            subs.splice(index, 1);
        };
    };

    const query = (q) => {
        return _val.gqlQuery(q);
    };

    return { subscribe, query };
}