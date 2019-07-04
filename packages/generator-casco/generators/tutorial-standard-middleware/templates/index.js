const Casco = require('casco');
const router = require('casco/lib/middleware/router-s2json');

require('dotenv').config();


const app = Casco();

// default router-s2json implements the following protocol:
// txOutput 0: OP_RETURN <BITCOM_ID> <JSON ENCODED ARRAY I.E. [func, arg1, arg2, ...]>
// Fills req.route, req.args, req.caller
app.use(router);

app.use('myRoute', (req, res) => {
  console.log('myRoute handler was called');
  console.log(req);
});

app.listen(`bit://${process.env.ADDRESS}`, <%= height %>);
