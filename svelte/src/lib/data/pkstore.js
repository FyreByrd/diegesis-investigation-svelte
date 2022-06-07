import { Proskomma } from 'proskomma';
import { thaw } from 'proskomma-freeze';


export function pkStore(files) {
    let _val = new Proskomma();
    const subs = [];
    for(var f of files) {
        thaw(_val, f);
    }

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