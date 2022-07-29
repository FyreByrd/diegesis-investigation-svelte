const {pkWithDocs} = require("./load");
const fs = require("fs-extra");
const { freeze } = require('proskomma-freeze');

const filenames = [
    'eng_web_pent_and_gosp', 
    'en_UK_webbe_pent_and_gosp',
    'grc_mt_gosp'
];

const writeFileAsync = async function (promise, fname, pk) {
    content = await promise;
    fs.writeFile(fname+".js", 
        "const "+fname+" = \""+content+"\";\n\nexport {"+fname+"};", 
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

for(fname of filenames) {
    const pk = pkWithDocs(
        JSON.parse(fs.readFileSync(fname+".json"))
    );

    const frozen = freeze(pk);

    writeFileAsync(frozen, fname, pk);
}
