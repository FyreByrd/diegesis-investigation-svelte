import { Proskomma } from 'proskomma';
import { thaw } from 'proskomma-freeze';
import { docSets } from './docSets/docSets';

export function pkStore() {
    let _val = new Proskomma();
    const subs = [];

    const memo = {initialized: null}
    function memoInit(){
        if(memo["initialized"] !== null) {
            return memo["initialized"];
        }

        memo["initialized"] = init(); // memoize the promise for key
        return memo["initialized"];
    }

    //thaws frozen archives
    const init = async () => {
        console.log("initializing")
        for(const ds of docSets) {
            await thaw(_val, ds);
        }
        console.log("initialized")
    }

    const subscribe = (cb) => {
        subs.push(cb);
        cb(_val);
        
        return () => {
            const index = subs.findIndex((fn) => fn === cb);
            subs.splice(index, 1);
        };
    };

    const query = async (q,cb) => {
        await memoInit();
        let j = JSON.stringify(await _val.gqlQuery(q), null, 2);
        if(cb) { cb(j); }
        return j;
    };

    const gqlQuery = async (q,cb) => { query(q,cb)}

    return { subscribe, query, gqlQuery };
}