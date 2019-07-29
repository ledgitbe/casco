const axios = require('axios');
const EventSource = require('eventsource');
const JSONStream = require('JSONStream');
const es = require('event-stream');

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

const bitdb = {
  queries : {
    socket: {
      bit(address) {
        return {
          v: 3,
          q: {
            find: {
              "out.b0": {
                "op": 106
              },
              "out.s1" : address
            },
          }
        }
      },

      paymentTo(address) {
        return {
          v: 3,
          q: {
            find: { "out.e.a" : address },
          }
        }
      },

      paymentFrom(address) {
        return {
          v: 3,
          q: {
            find: { "in.e.a" : address },
          }
        }
      }
    },

    db: {
      bit(address, height) {
        height = height || 0;
        return {
          "v": 3,
          "db": "c",
          "q": {
            "find": { 
              "out.b0": {
                "op": 106
              },
              "out.s1": address, 
              "$or": [ { "blk.i" : {"$gt": height }}, { "blk.i": { "$exists" : false } } ]
            },
            "sort": { "blk.t": 1 }
          }
        }
      },

      paymentTo(address, height) {
        height = height || 0;
        return {
          v: 3,
          q: {
            "db": "c",
            find: { 
              "out.e.a" : address,
              "$or": [ { "blk.i" : {"$gt": height }}, { "blk.i": { "$exists" : false } } ]
            },
          }
        }
      },

      paymentFrom(address, height) {
        height = height || 0;
        return {
          v: 3,
          q: {
            "db": "c",
            find: { 
              "in.e.a" : address,
              "$or": [ { "blk.i" : {"$gt": height }}, { "blk.i": { "$exists" : false } } ]
            },
          }
        }
      }
    }
  },

  listen(query, handler) {
    const url = endpoints.socket + btoa(JSON.stringify(query));

    let events = new EventSource(url);

    events.onmessage = (message) => {
      if (message.type === 'open' || message.type === 'block') {
        return;
      }
      let data;
      try {
        data = JSON.parse(message.data);
      } catch(e) {
        console.error(e);
        return;
      }

      if (data.type !== 'u') {
        return;
      }

      let bitDbResponse = data.data[0];

      // This handler is provided by sync(), it will make sure these events
      // are stalled while crawling
      handler(bitDbResponse);
    };
  },

  crawl(query, handler) {
    return new Promise((resolve, reject) => {
      const path = btoa(JSON.stringify(query));

      client({
        method: 'get',
        url: path,
        responseType: 'stream'
      })
        .then(res => res.data)
        .then(stream => {
          stream
            .pipe(JSONStream.parse('c.*'))
            .pipe(es.mapSync(handler))
            .pipe(es.wait(resolve))
        });
    });
  },
}

module.exports = bitdb;
