const ledgit = require('ledgit');

require('dotenv').config();

const app = ledgit();

/*
 * Define your application handlers here
 *
 * For example:
 *
 * app.use((req, res) => {
 *  console.log("New tx!");
 *  console.log(req.tx);
 *  })
 *
 * Check out the other examples and the documentation.
 *
 */

app.listen(`bit://${process.env.ADDRESS}`, <%= height %>);
