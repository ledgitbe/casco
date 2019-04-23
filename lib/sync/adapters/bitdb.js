const axios = require('axios');
const EventSource = require('eventsource');

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
      bitcom(address) {
        return {
          v: 3,
          q: {
            find: { "out.s1" : address },
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
      bitcom(address, height) {
        height = height || 0;
        return {
          "v": 3,
          "q": {
            "find": { 
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
            find: { 
              "in.e.a" : address,
              "$or": [ { "blk.i" : {"$gt": height }}, { "blk.i": { "$exists" : false } } ]
            },
          }
        }
      }
    }
  },

  socket(query) {
    const url = endpoints.socket + btoa(JSON.stringify(query));

    return new EventSource(url);
  },

  db(query) {
    const path = btoa(JSON.stringify(query));

    return client.get(path)
      .then(r => r.data)
      .then(r => {
        return r.c.concat(r.u) // confirmed txs + unconfirmed txs
      });
  },
}



module.exports = bitdb;
