import { Proskomma } from 'proskomma';
import { thaw } from 'proskomma-freeze';
import { docSets } from '$lib/data/docSets/docSets.js';

const pk = (() => {
    let _val = new Proskomma();

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
        for(const ds of docSets) {
            await thaw(_val, ds);
        }
    }

    const query = async (q,cb) => {
        await memoInit();
        let j = await _val.gqlQuery(q);
        if(cb) { cb(j); }
        return j;
    };

    const gqlQuery = async (q,cb) => { query(q,cb) }

    return { query, gqlQuery };
})();

export async function post({request}) {
    const body = await request.json();
    //console.log("request: "+JSON.stringify(body, null, 2));
    return {
        body: {
            text: await pk.query(body.query)
        }
    }
}