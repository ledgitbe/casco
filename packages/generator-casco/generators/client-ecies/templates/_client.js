#!/usr/bin/node

const path = require("path");
const Datapay = require("datapay");
const QRCode = require("qrcode-terminal");
const ECEIS = require("bsv/ecies");
const { PrivateKey, PublicKey } = require("bsv");

require("dotenv").config({
  path: path.resolve(process.cwd(), `.env.${path.basename(__filename, ".js")}`)
});

if (process.argv.length < 3) {
  console.log(`Usage: ./client-${process.env.ADDRESS}.js func [args...]`);
  console.log(
    `Refund remaining balance: ./client-${process.env.ADDRESS}.js --refund [ADDRESS]`
  );
  console.log(`Address: ${process.env.ADDRESS}`);
  QRCode.generate(process.env.ADDRESS, { small: true });
  process.exit(0);
}

if (process.argv[2] === "--refund") {
  Datapay.connect().getUnspentUtxos(process.env.ADDRESS, (err, utxos) => {
    if (err) {
      console.log("Error: ", err);
    } else {
      var balance = 0;
      utxos.forEach(utxo => {
        balance += utxo.satoshis;
      });
      Datapay.send(
        {
          pay: {
            key: process.env.PRIVATE_KEY,
            to: [{ address: process.argv[3], value: balance - 400 }],
            rpc: "https://api.mattercloud.net"
          }
        },
        (err, txid) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`Transaction sent. ${txid}`);
          }
        }
      );
    }
  });
} else {
  const func = process.argv[2];
  const args = process.argv.slice(3);

  const CID = ECEIS()
    .privateKey(PrivateKey.fromWIF(process.env.PRIVATE_KEY))
    .publicKey(PublicKey(process.env.PREFIX_PUBLIC_KEY));

  const plaintext = JSON.stringify([func, ...args]);
  const encrypted = CID.encrypt(plaintext);

  Datapay.send(
    {
      safe: true,
      pay: { rpc: "https://api.mattercloud.net", key: process.env.PRIVATE_KEY },
      data: [process.env.PREFIX, encrypted]
    },
    (err, txid) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Transaction sent. ${txid}`);
      }
    }
  );
}
