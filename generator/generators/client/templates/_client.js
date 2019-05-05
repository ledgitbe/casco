#!/usr/bin/node

const path = require('path');
const Datapay = require('datapay')
const QRCode = require('qrcode-terminal');

require('dotenv').config({ path: path.resolve(process.cwd(), `.env.${path.basename(__filename, '.js')}`) });

if (process.argv.length < 3) {
  console.log(`Usage: ./client-${process.env.ADDRESS}.js func [args...]`);
  console.log(`Address: ${process.env.ADDRESS}`);
  QRCode.generate(process.env.ADDRESS, { small: true });
  process.exit(0);
}

if (process.argv[2] === '--refund') {
  Datapay.connect().getUnspentUtxos(process.env.ADDRESS, (err, utxos) => {
    if (err) {
      console.log("Error: ", err)
    } else {
      var balance = 0;
      utxos.forEach((utxo) => {
        balance+=utxo.satoshis;
      });
      Datapay.send(
        {
          pay: { 
            key: process.env.PRIVATE_KEY,
            to: [{address: process.argv[3],value: balance-400}]
          }

        },
        (err, txid) => { 
          if (err) {
            console.log(err)
          } else {
            console.log(`Transaction sent. ${txid}`);
          }
        }
      );
    }
  })
} else {
  const func = process.argv[2];
  const args = process.argv.slice(3);

  Datapay.send(
    {
      data: [process.env.PREFIX, JSON.stringify([func, ...args])],
      pay: { key: process.env.PRIVATE_KEY }
    },
    (err, txid) => { 
      if (err) {
        console.log(err)
      } else {
        console.log(`Transaction sent. ${txid}`);
      }
    }
  );
}
