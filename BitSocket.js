const EventSource = require('eventsource');
const urljoin = require('urljoin');

module.exports = function BitSocket(_query, _url) {
  let query = _query || {
    "v": 3,
    "q": {
      "find": {}
    },
  };
  let url = _url || 'https://genesis.bitdb.network/s/1FnauZ9aUH2Bex6JzdcV4eNX7oLSSEbxtN/';
  let b64 = Buffer.from(JSON.stringify(query)).toString("base64");
  let endpoint = urljoin(url, b64);
  // console.info('Connecting to BitSocket endpoint', endpoint);

  return new EventSource(endpoint);
}
