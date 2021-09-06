const polka = require('polka');
const send = require('@polka/send-type');
const { json } = require('body-parser');
const { PORT=3000 } = process.env;
const Database = require('better-sqlite3');
const db = new Database('atm.db', { verbose: console.log });

const getBalance = (name) => {
    const rows = db.prepare('SELECT * FROM history WHERE name = ?').all(name);
    if(rows.length > 0) {
        //iterate to get balance

        return rows;
    } else {
        return 0;
    }
}

const auth = (data) => {
    const row = db.prepare('SELECT * FROM user where name = ?').get(data.name);
    if(row) {
        //check password
        if(row.password == data.password) {
            return row;
        } else {
            return false;
        }
    } else {
        db.prepare('INSERT INTO user VALUES (?, ?, ?)').run(data.name, '1234', 0);
        return {
            name: data.name,
            balance:0,
        };
    }
}

const deposit = (data) => {
    //get current user balance
    const row = db.prepare('SELECT * FROM user where name = ?').get(data.name);
    if(row) {
        let balance = row.balance;
        //add history 
        const date = new Date();

        const info = db.prepare('INSERT INTO history VALUES (?, ?, ?, ?, ?)').run(data.name, 'deposit', '', parseInt(data.amount), date.toISOString());

        if (info.changes == 1) {
            //update user balance
            balance = parseInt(data.amount) + parseInt(balance);
            db.prepare('UPDATE user SET balance = ? WHERE name = ?').run(parseInt(balance), data.name);

            return balance;
        } else {
            return false;
        }

    } else {
        return false;
    }
}

const transfer = (data) => {
    //get current user balance
    const row = db.prepare('SELECT * FROM user where name = ?').get(data.name);
    //get destination
    const rowDest = db.prepare('SELECT * FROM user where name = ?').get(data.destination);

    if(row && rowDest) {
        let balanceUser = row.balance;
        let balanceDest = rowDest.balance;

        //add history 
        const date = new Date();

        const info = db.prepare('INSERT INTO history VALUES (?, ?, ?, ?, ?)').run(data.name, 'transfer', data.destination, parseInt(data.amount), date.toISOString());

        if (info.changes == 1) {
            //update user balance
            balanceUser = parseInt(balanceUser) - parseInt(data.amount);
            db.prepare('UPDATE user SET balance = ? WHERE name = ?').run(parseInt(balanceUser), data.name);
            //update destination balance
            balanceDest = parseInt(data.amount) + parseInt(balanceDest);
            db.prepare('UPDATE user SET balance = ? WHERE name = ?').run(parseInt(balanceDest), data.destination);

            return balanceUser;
        } else {
            return false;
        }

    } else {
        return false;
    }
}

polka()
    .use(json())
    
    .get('/', (req, res) => {
          send(res, 200, { hello: 'world' });
    })
    
    .post('/login', (req, res) => {
          console.log(req.body);
          const user = auth(req.body);

              let resp = {
                  name: req.body.name,
                  balance: 0
              }

              if(user == false) {
                  send(res, 200, {error: 'incorrect password'});
              } else {
                  //get balance
                  resp.balance = user.balance;
                  send(res, 200, {data: resp});
              }
          
    })
    
    .post('/deposit', (req, res) => {
        console.log(req.body);
        if(!req.body.name) {
            send(res, 200, {error: 'no name defined'});
        } else {
            const balance = deposit(req.body);
            let resp = {
                name: req.body.name,
                balance: 0
            }

            if(balance == false) {
                  send(res, 200, {error: 'cannot deposit'});
            } else {
                //get balance
                resp.balance = balance;
                send(res, 200, {data: resp});
            }

        }
    })

    .post('/transfer', (req, res) => {
        console.log(req.body);
        if(!req.body.name) {
            send(res, 200, {error: 'no name defined'});
        } else {
            //can not transfer same name
            if(req.body.destination == req.body.name) {
                send(res, 200, {error: 'destination can not be the same as sender'});
            } else {
                const balance = transfer(req.body);
                let resp = {
                    name: req.body.name,
                    destination: req.body.destination,
                    amount: req.body.amount,
                    balance: 0
                }

                if(balance == false) {
                      send(res, 200, {error: 'cannot transfer'});
                } else {
                    //get balance
                    resp.balance = balance;
                    send(res, 200, {data: resp});
                }
            }

        }
    })

    .listen(PORT, () => {
        console.log(`> Running on localhost:${PORT}`);
    });