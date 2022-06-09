import { Proskomma } from 'proskomma';
import { thaw } from 'proskomma-freeze';
import {eng_web_jhn} from './eng_web_jhn';


export function pkStore() {
    let _val = new Proskomma();
    let initialized = false;
    const subs = [];

    //thaws frozen archives
    const init = async () => {
        if(!initialized) {
            await thaw(_val, eng_web_jhn);
        }
        initialized = true;
    }

    const subscribe = (cb) => {
        subs.push(cb);
        cb(_val);
        
        return () => {
            const index = subs.findIndex((fn) => fn === cb);
            subs.splice(index, 1);
        };
    };

    const query = async (q) => {
        //ensures _val is initialized before querying
        if(!initialized) {
            await init();
        }
        console.log("query")
        let r = await _val.gqlQuery(q, () => console.log("finished query"));
        console.log("r")
        console.log(JSON.stringify(r, null, 2))
        return r;
    };

    return { subscribe, query };
}