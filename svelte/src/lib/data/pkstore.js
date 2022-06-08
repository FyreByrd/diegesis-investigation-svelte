import { Proskomma } from 'proskomma';
import { thaw } from 'proskomma-freeze';
import {eng_web_jhn} from './eng_web_jhn';


export function pkStore() {
    let _val = new Proskomma();
    let initialized = false;
    const subs = [];

    //thaws frozen archives
    const init = async () => {
        await thaw(_val, eng_web_jhn);
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
        return _val.gqlQuery(q, () => console.log("finished query"));
    };

    return { subscribe, query };
}