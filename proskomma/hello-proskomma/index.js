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
/*
const dataQuery = `{
    docSets { 
        id
        document(bookCode:"PSA") {
            bookCode: header(id: "bookCode")
            cv(chapterVerses:"${parsedReference.split(/\s+/)[1]}") {
                scopeLabels(startsWith:["chapter", "verses"])
                text
            }
            mainSequence {
                blocks(withScriptureCV:"${parsedReference.split(/\s+/)[1]}") {
                    scopeLabels(startsWith: ["blockTag"])
                    text (withScriptureCV:"${parsedReference.split(/\s+/)[1]}")
                    items{type subType payload}
                }
            }
        }
    }
}`;
*/
const dataQuery = `{
    docSets { 
        id
        document(bookCode:"PSA") {
            bookCode: header(id: "bookCode")
            cv(chapterVerses:"150:1-2") {
                scopeLabels(startsWith:["chapter", "verses"])
                text
            }
            mainSequence {
                blocks(withScriptureCV:"150:1") {
                    scopeLabels(startsWith: ["blockTag"])
                    text (withScriptureCV:"150:1")
                    items{type subType payload}
                }
            }
        }
    }
}`;
queryPk(pk, dataQuery, printData);
