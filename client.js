const inquirer = require('inquirer');
const figlet = require('figlet');

const api = require('./libs/api');

const mainPrompt = require('./commands/main');
const loginPrompt = require('./commands/login');
const depositPrompt = require('./commands/deposit');
const transferPrompt = require('./commands/transfer');

const runCLI = async () => {
    
    try {

        const header = figlet.textSync('Demo  ATM', {
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true
        });
        console.log(header);

        const answers = await inquirer.prompt(loginPrompt);

        const serverRes = await api.login(answers);
        
        if(serverRes.data) {
           console.log(`Hello ${serverRes.data.name}!`);
           console.log(`your balance is $ ${serverRes.data.balance}`);
           await main(serverRes.data.name);
        } else {
            console.log(`error: ${serverRes.error}`);
            await runCLI();
        }
        
    
    } catch(err) {
        if (err.isTtyError) {
          console.error('environment not supported');
        } else {
          console.error(err);
        }
    }
    
}

const main = async (name) => {
    
    try {

        const answers = await inquirer.prompt(mainPrompt);
        switch(answers.mainmenu) {

            case 'deposit':
                await deposit(name);
            break;

            case 'transfer':
                await transfer(name);
            break;

            case 'logout':
                await logout(name);
            break;
        }
    
    } catch(err) {
        if (err.isTtyError) {
          console.error('environment not supported');
        } else {
          console.error(err);
        }
    }
}

const deposit = async (name) => {
    
    try {
        const answers = await inquirer.prompt(depositPrompt);
        const data = Object.assign(answers, {name: name});
        const serverRes = await api.deposit(data);
        if(serverRes.data) {
           console.log(`your balance is $ ${serverRes.data.balance}`);
           await main(serverRes.data.name);
        } else {
            console.log(serverRes);
            await runCLI();
        }

    } catch(err) {
        if (err.isTtyError) {
          console.error('environment not supported');
        } else {
          console.error(err);
        }
    }

}

const transfer = async (name) => {

    try {
        const answers = await inquirer.prompt(transferPrompt);
        Object.assign(answers, {name: name});
        const serverRes = await api.transfer(answers);
        
        if(serverRes.data) {
           console.log(`transfered ${serverRes.amount} to $ ${serverRes.data.destination}`);
           console.log(`your balance is $ ${serverRes.data.balance}`);
           await main(serverRes.data.name);
        } else {
            console.log(`error: ${serverRes.error}`);
            await runCLI();
        }

    } catch(err) {
        if (err.isTtyError) {
          console.error('environment not supported');
        } else {
          console.error(err);
        }
    }

}

const logout = async (name) => {

    try {
        console.log(`good bye, ${name}!`);
    
    } catch(err) {
        if (err.isTtyError) {
          console.error('environment not supported');
        } else {
          console.error(err);
        }
    }

}

runCLI();