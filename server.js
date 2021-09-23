const polka = require('polka');
const send = require('@polka/send-type');
const { json } = require('body-parser');
const { PORT=3000 } = process.env;
const Database = require('better-sqlite3');
const db = new Database('atm.db', { verbose: console.log });

const getUser = (name) => {
    const row = db.prepare('SELECT * FROM user WHERE name = ?').get(name);
    if(row) {
        return row;
    } else {
        return false;
    }
}

const auth = (data) => {
    const user = getUser(data.name);
    if(user) {
        //check password
        if(user.password == data.password) {
            return user;
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

const addDeposit = (data) => {
    const date = new Date();

    const info = db.prepare('INSERT INTO history VALUES (?, ?, ?, ?, ?)').run(data.name, 'deposit', '', parseInt(data.amount), date.toISOString());
    
    if (info.changes == 1) {
        return true;
    } else {
        return false;
    }
}

const addTransfer = (data) => {
    const date = new Date();

    const info = db.prepare('INSERT INTO history VALUES (?, ?, ?, ?, ?)').run(data.name, 'transfer', data.destination, parseInt(data.amount), date.toISOString());
    
    if (info.changes == 1) {
        return true;
    } else {
        return false;
    }
}

const userHasOwe = (data) => {
    //get user owe
    const row = db.prepare('SELECT * FROM owe where who = ? AND to = ? AND owe > 0 ORDER BY date(created) DESC Limit 1').get(data.name, data.destination);
    
    if(row) {
        return row;
    } else {
        return false;
    }
}

const getOneOwe = (data) => {
    //get user owe
    const row = db.prepare('SELECT * FROM owe where who = ? AND owe > 0 ORDER BY date(created) DESC').get(data.name);
    if(row) {
        return row;
    } else {
        return false;
    }
}

const addOwe = (data, amount) => {
    //add new owe
    const info = db.prepare('INSERT INTO owe VALUES (?, ?, ?, ?)').run(amount, data.name, data.destination, date.toISOString());
    
    if(info.changes == 1) {
        return true;
    } else {
        return false;
    }
}

const updateOwe = (name, destination, amount) => {
    //add new owe
    const info = db.prepare('UPDATE owe SET owe = ? WHERE who = ? AND to = ?').run(amount, name, destination);
    
    if(info.changes == 1) {
        return true;
    } else {
        return false;
    }
}

const updateBalance = (name, amount) => {
    //add new owe
    const info = db.prepare('UPDATE user SET balance = ? WHERE name = ?').run(parseInt(amount), name);
    
    if(info.changes == 1) {
        return true;
    } else {
        return false;
    }
}

const updateBalanceUser = (data, balance) => {
    
    const newBalance = balance + parseInt(data.amount);  

    const info = db.prepare('UPDATE user SET balance = ? WHERE name = ?').run(newBalance, data.name);

    if(info.changes == 1) {
        return newBalance;
    } else {
        return false;
    }
}

const deposit = (data) => {
    const user = getUser(data.name);

    if(user) {
        let balance = user.balance;
        //add history 
        const depositHist = addDeposit(data);

        if (depositHist == true) {
            return updateBalanceUser(data, balance);

        } else {
            return false;
        }

    } else {
        return false;
    }
}

const transfer = (data) => {
    
    const userFrom = getUser(data.name);
    const userTo = getUser(data.destination);

    if(userFrom && userTo) {
        let balanceUser = userFrom.balance;
        let balanceDest = userTo.balance;

        const transferHist = addTransfer(data);

        if (transferHist == true) {
            
            if(parseInt(data.amount) > balanceUser) {
                let newBalanceUser = 0;
                const owe = parseInt(data.amount) - balanceUser;
                const realTransfer = balanceUser;

                //update user balance
                const updateBalanceResult = updateBalance(userFrom.name, newBalanceUser);
                //update user owe
                const updateOweResult = updateOwe(userFrom.name, userTo.name, owe);
                //update destination balance
                const updateBalanceDestResult = updateBalance(userFrom.destination, realTransfer);

            
            } 


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