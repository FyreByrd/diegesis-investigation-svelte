const {pkWithDocs} = require("./load");
const fs = require("fs-extra");
const { freeze } = require('proskomma-freeze');

const filename = 'eng_web_jhn';

const pk = pkWithDocs(
    JSON.parse(fs.readFileSync(filename+".json")).canon
);

const frozen = freeze(pk);

const writeFileAsync = async function (promise, fname) {
    content = await promise;
    fs.writeFile(fname+".js", 
        "const "+fname+" = \""+content+"\";\n\nmodule.exports = "+fname+";", 
        function (err) {
            if (err) throw err; 
        });
    console.log("wrote to "+fname+".js:");
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
