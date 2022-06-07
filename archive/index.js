const {pkWithDocs} = require("./load");
const fs = require("fs-extra");
const { freeze } = require('proskomma-freeze');

const filename = 'test.pkzip';

const pk = pkWithDocs(
    JSON.parse(fs.readFileSync("./usfm/eng_lsv.json")).canon
);

const frozen = freeze(pk);

const writeFileAsync = async function (promise, fname) {
    content = await promise;
    fs.writeFile(fname, content, function (err) {
        if (err) throw err; 
    });
    console.log("wrote to "+fname+":");
        const result = await pk.gqlQuery(`{
            docSets { 
                id
                documents {
                    bookCode: header(id: "bookCode")
                }
            }
        }`);
        console.log(JSON.stringify(result, null, 2));
}

writeFileAsync(frozen, filename);
