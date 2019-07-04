const Casco = require('casco');
const router = require('casco/lib/middleware/router-s2json');
const responder = require('casco/lib/middleware/responder');

require('dotenv').config();

const app = Casco()

// Fills req.route, req.args, req.caller
app.use(router);

// Attach req.send if we're not syncing
app.use(responder(process.env.PRIVATE_KEY, (err, txid) => {console.log(err, txid)}));

app.use('pong', (req, res) => {
  res.send([process.env.ADDRESS, JSON.stringify(["ping", req.tx.tx.h])]);
});

app.listen(`bit://${process.env.ADDRESS}`, <%= height %>);
