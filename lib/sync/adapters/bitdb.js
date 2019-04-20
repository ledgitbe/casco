const axios = require('axios');
const EventSource = require('eventsource');

const endpoints = {
  query: 'https://genesis.bitdb.network/q/1FnauZ9aUH2Bex6JzdcV4eNX7oLSSEbxtN/',
  socket: 'https://genesis.bitdb.network/s/1FnauZ9aUH2Bex6JzdcV4eNX7oLSSEbxtN/'
}

const client = axios.create({
  baseURL: endpoints.query
});
client.defaults.headers.common.key = "1Jq9jjwioj9uj21uknxQIjoiijqw98u21joqoi";

if (typeof btoa !== 'function') {
  function btoa(str) {
    return Buffer.from(str.toString(), 'binary').toString('base64');
  }
}

const bitdb = {
  findAllContractTxsQuery(address, from) {
    return {
      "v": 3,
      "q": {
        "find": { "out.s1": address, "$or": [ { "blk.i" : {"$gt": from }}, { "blk.i": { "$exists" : false } } ] },
        "sort": { "blk.t": 1 }
      }
    }
  },

  findAllContractTxs(address, from) {
    const query = this.findAllContractTxsQuery(address, from),
          path = btoa(JSON.stringify(query));

    return client.get(path)
      .then(r => r.data)
      .then(r => {
        // console.log(r);
        return r.c.concat(r.u) // confirmed txs + unconfirmed txs
      });
  },

  listenForAllContractTxsQuery(address) {
    return {
      v: 3,
      q: {
        find: { "out.s1" : address },
      }
    }
  },

  listenForAllPaymentTxsQuery(address) {
    return {
      v: 3,
      q: {
        find: { "out.e.a" : address },
      }
    }
  },

  socket(address) {
    const query = this.listenForAllContractTxsQuery(address),
          url = endpoints.socket + btoa(JSON.stringify(query));

    return new EventSource(url);
  }
}

bitdb.findAllPaymentTxsQuery = bitdb.listenForAllPaymentTxsQuery;

module.exports = bitdb;
