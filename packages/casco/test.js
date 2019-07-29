const axios = require('axios');
const EventSource = require('eventsource');
const JSONStream = require('JSONStream');
const es = require('event-stream');
const tee = require('tee');
const http = require('https');
const request = require('request');

const endpoints = {
  query: 'https://genesis.bitdb.network/q/1FnauZ9aUH2Bex6JzdcV4eNX7oLSSEbxtN/',
  socket: 'https://genesis.bitdb.network/s/1FnauZ9aUH2Bex6JzdcV4eNX7oLSSEbxtN/'
}

const client = axios.create({
  baseURL: endpoints.query
});
client.defaults.headers.common.key = "1FnH41RQEpkLgBujokySG3tsCDwbvg5g6k";

if (typeof btoa !== 'function') {
  function btoa(str) {
    return Buffer.from(str.toString(), 'binary').toString('base64');
  }
}

function db(query) {
    const path = btoa(JSON.stringify(query));

  return client({
    method: 'get',
    url: path,
    responseType: 'json'
  })
    .then(res => {
        console.log(res.data);
        console.log("=========================");
    });
}

function dbstream(query) {
    const path = btoa(JSON.stringify(query));

  return client({
    method: 'get',
    url: path,
    responseType: 'stream'
  })
    .then(res => {
      res.data
        .pipe(JSONStream.parse('c.*'))
        .pipe(es.mapSync(data => {
        console.log(counter++, data);
      }))
    });
}

function dbstream2(query) {
    const path = btoa(JSON.stringify(query));

  const options = {
    url: endpoints.query + path,
    headers: { key: client.defaults.headers.common.key },
    method: 'GET'
  };

  request(options)
    .pipe(JSONStream.parse('c.*'))
    .pipe(es.mapSync(data => {
      console.log(counter++, data);
    }))
}

var counter = 0;

//db({"v":3,"q":{"find":{"out.b0":{"op":106},"out.s2":"set","$or":[{"blk.i":{"$lt":99999999}},{"blk.i":{"$exists":false}}]},"sort":{"blk.t":1}}});
//dbstream({"v":3,"q":{"find":{"out.b0":{"op":106},"out.s2":"set","$or":[{"blk.i":{"$lt":99999999}},{"blk.i":{"$exists":false}}]},"sort":{"blk.t":1}}});

//db({"v": 3,"q": {  db: ["c"], "find": {},   "limit": 100},   "r": { "f": "[.[] | .out[0] | { token_symbol: .s4, token_name: .s5, document_url: .s6} ]"  }});
//dbstream({"v": 3,"q": {  db: ["c"], "find": {},   "limit": 100},   "r": { "f": "[.[] | .out[0] | { token_symbol: .s4, token_name: .s5, document_url: .s6} ]"  }});
dbstream2({"v": 3,"q": {  db: ["c"], "find": {},   "limit": 1000},   "r": { "f": "[.[] | .out[0] | { token_symbol: .s4, token_name: .s5, document_url: .s6} ]"  }});
