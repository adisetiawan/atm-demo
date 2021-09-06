const polka = require('polka');
const send = require('@polka/send-type');
const { json } = require('body-parser');
const { PORT=3000 } = process.env;

polka()
    .use(json())
    .get('/', (req, res) => {
          send(res, 200, { hello: 'world' });

    })
    .listen(PORT, () => {
        console.log(`> Running on localhost:${PORT}`);
    });