const fs = require("fs-extra");
const { thaw } = require('proskomma-freeze');
const { Proskomma } = require('proskomma');
const { eng_web_full } = require('./eng_web_full');

const pk = new Proskomma();

const readFileAsync = async function (fname, cb) {
    await thaw(pk, fname);
    //console.log("read "+fname+":");
    await pk.gqlQuery(`{
        docSet (id: "eng_web") {
            id
            selectors { key value }
            tags
            document (bookCode: "JHN") {
                id
                headers { key value }
                idParts { type parts }
                tags
                sequences {
                    id
                    type
                    blocks {
                        bs { payload }
                        bg { subType payload }
                        items { type subType payload }
                    }
                }
            }
        }
    }`, 
    (result) => cb(JSON.stringify(result, null, 2)));
}

readFileAsync(eng_web_full, r => fs.writeFileSync('./eng_web_full.json',r));
