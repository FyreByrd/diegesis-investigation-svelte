const path = require('path');
const fse = require('fs-extra');
const { Proskomma } = require('proskomma');
const pk = new Proskomma();
let content = fse.readFileSync(path.resolve(__dirname, './psa.usfm')).toString();

const queryPk = async function (pk, query, callback) {
    const result = await pk.gqlQuery(query);
    callback(JSON.stringify(result, null, 2));
}

const printData = function(json) {
    console.log(json);
}

const mutation = `mutation { addDocument(` +
    `selectors: [{key: "lang", value: "eng"}, {key: "abbr", value: "ust"}], ` +
    `contentType: "usfm", ` +
    `content: """${content}""") }`;

queryPk(pk, mutation, () => {});

const dataQuery = `{
    documents {
        headers {
            key
            value
        }
    }
}`;
queryPk(pk, dataQuery, printData);
