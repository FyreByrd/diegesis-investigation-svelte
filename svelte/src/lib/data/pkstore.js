import { Proskomma } from 'proskomma';
import { thaw } from 'proskomma-freeze';
import {eng_web_jhn} from './eng_web_jhn';
import {eng_lsv_pent} from './eng_lsv_pent';

export function pkStore() {
    let _val = new Proskomma();
    //let initialized = null;
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
        //console.log("initializing");
        await thaw(_val, eng_web_jhn);
        await thaw(_val, eng_lsv_pent);
        //console.log("initialized")
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