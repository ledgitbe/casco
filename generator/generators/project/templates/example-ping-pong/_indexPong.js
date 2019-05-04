const ledgit = require('ledgit');
const router = require('ledgit/lib/middleware/router-s2json');
const responder = require('ledgit/lib/middleware/responder');

require('dotenv').config();

const app = ledgit();

// Fills req.route, req.args, req.caller
app.use(router);

// Attach req.send if we're not syncing
app.use(responder(process.env.PRIVATE_KEY, (err, txid) => {console.log(err, txid)}));

app.use('pong', (req, res) => {
  res.send([process.env.ADDRESS, 'ping', JSON.stringify([req.tx.tx.h])]);
});

app.listen(`bit://${process.env.ADDRESS}`, <%= height %>);
