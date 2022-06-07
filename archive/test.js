const fs = require("fs-extra");
const { thaw } = require('proskomma-freeze');
const { Proskomma } = require('proskomma');

const pk = new Proskomma();

const readFileAsync = async function (fname) {
    await thaw(pk, fs.readFileSync(fname).toString())
    console.log("read "+fname+":");
    await pk.gqlQuery(`{
        nDocSets
        docSets { 
            id
        }
    }`, 
    (result) => console.log(JSON.stringify(result, null, 2)));
}

readFileAsync("WEB.pkzip");
readFileAsync("./usfm/lsv.pkzip");
