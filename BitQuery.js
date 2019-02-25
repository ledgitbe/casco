const fetch = require('node-fetch');
const urljoin = require('urljoin');

module.exports = async function(query, _url) {
  if (!query) return [];

  let b64 = Buffer.from(JSON.stringify(query)).toString("base64");
  let url = _url || "https://genesis.bitdb.network/q/1FnauZ9aUH2Bex6JzdcV4eNX7oLSSEbxtN/";

  url = urljoin(url, b64);

  // Attach API KEY as header
  var header = {
    headers: { key: "qpne29ue8chsv9pxv653zxdhjn45umm4esyds75nx6" }
  };

  return fetch(url, header)
    .then(function(r) {
      return r.json()
    })
}

