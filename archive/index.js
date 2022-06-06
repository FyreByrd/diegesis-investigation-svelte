const {pkWithDocs} = require("./load");
const fs = require("fs-extra");
const { freeze, thaw } = require('proskomma-freeze');

const filename = 'test.pkzip';

const pk = pkWithDocs([
    ['./usfm/02-GENeng-web.usfm', {
        lang: 'eng',
        abbr: 'web',
    }],
    ['./usfm/03-EXOeng-web.usfm', {
        lang: 'eng',
        abbr: 'web',
    }],
    ['./usfm/04-LEVeng-web.usfm', {
        lang: 'eng',
        abbr: 'web',
    }],
    ['./usfm/05-NUMeng-web.usfm', {
        lang: 'eng',
        abbr: 'web',
    }],
    ['./usfm/06-DEUeng-web.usfm', {
        lang: 'eng',
        abbr: 'web',
    }],
]);

const frozen = freeze(pk);

const writeFileAsync = async function (promise, fname) {
    content = await promise;
    fs.writeFile(fname, content, function (err) {
        if (err) throw err;
        console.log("wrote file '"+fname+"'");
    });
}

writeFileAsync(frozen, filename);

/*
const queryPk = async function (pk, query, callback) {
    const result = await pk.gqlQuery(query);
    callback(result);
}

const printData = function(json) {
    console.log(JSON.stringify(json, null, 2));
}

const dataQuery = `{
    docSets { 
        id
        documents {
            bookCode: header(id: "bookCode")
        }
    }
}`;
queryPk(pk, dataQuery, printData);*/