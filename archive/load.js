const path = require('path');
const fse = require('fs-extra');

const { Proskomma } = require('proskomma');

const pkWithDocs = (docSet) => {
  const pk = new Proskomma();

  for (const doc of docSet.canon) {
    const content = fse.readFileSync(path.resolve(__dirname, doc.file));
    let contentType = doc.file.split('.').pop();
    pk.importDocument(
      docSet.selectors,
      contentType,
      content,
      {},{},{},
      doc.tags
    );
  }
  return pk;
};

module.exports = { pkWithDocs };