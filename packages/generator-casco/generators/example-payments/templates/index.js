const Casco = require('casco');
const QRCode = require('qrcode-terminal');

require('dotenv').config();

console.log("");
console.log("Send a payment to this address:", process.env.ADDRESS);

QRCode.generate(process.env.ADDRESS, { small: true });

const app = Casco();

app.use((req, res) => {
  console.log("Payment detected!");

  // Find the tx out that has our address in it
  let output = req.tx.out.find(out => out.e.a === process.env.ADDRESS);

  let value = output.e.v;

  console.log("Value: ", value, "Satoshis");
});

app.listen(`paymentTo://${process.env.ADDRESS}`, <%= height %>);

// Also possible: paymentFrom
// But then you need to check the transaction inputs!
//app.listen(`paymentFrom://${process.env.ADDRESS}`, <%= height %>);
