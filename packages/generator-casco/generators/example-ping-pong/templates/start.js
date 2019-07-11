#!/usr/bin/node

const path = require('path');
const Datapay = require('datapay')
const QRCode = require('qrcode-terminal');

require('dotenv').config();

if (process.argv.length < 3) {
  console.log(`Usage: ./start.js ping`);
  console.log(`Address: ${process.env.ADDRESS}`);
  QRCode.generate(process.env.ADDRESS, { small: true });
  process.exit(0);
}
const func = process.argv[2];
Datapay.send(
  {
    data: [process.env.ADDRESS, JSON.stringify([func])],
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
