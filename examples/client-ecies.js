#!/usr/bin/node

const path = require('path');
const Datapay = require('datapay')
const QRCode = require('qrcode-terminal');
const ECEIS = require('bsv/ecies');

require('dotenv').config({ path: path.resolve(process.cwd(), `.env.${path.basename(__filename, '.js')}`) });

if (process.argv.length < 3) {
  console.log(`Usage: ./client-${process.env.ADDRESS}.js func [args...]`);
  console.log(`Address: ${process.env.ADDRESS}`);
  QRCode.generate(process.env.ADDRESS, { small: true });
  process.exit(0);
}
const func = process.argv[2];
const args = process.argv.slice(3);

const CID = ECEIS()
  .privateKey(PrivateKey.fromWIF(process.env.PRIVATE_KEY))
  .publicKey(PublicKey(process.env.PREFIX))

const plaintext = JSON.stringify([func, ...args]);
const encrypted = CID.encrypt(plaintext);

Datapay.send(
  {
    data: [process.env.PREFIX, encrypted],
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
