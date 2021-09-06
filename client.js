const inquirer = require('inquirer');
const figlet = require('figlet');

const mainPrompt = require('./commands/main');
const loginPrompt = require('./commands/login');
const depositPrompt = require('./commands/deposit');
const transferPrompt = require('./commands/transfer');

const runCLI = () => {
    const header = figlet.textSync('Demo  ATM', {
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
    });
    console.log(header);

    inquirer.prompt(loginPrompt).then((answers) => {
        console.log(answers);
        main(answers.username);

    });
}

const main = (name) => {
    
    console.log(`welcome ${name}`);

    inquirer.prompt(mainPrompt).then((answers) => {

        switch(answers.mainmenu) {

            case 'deposit':
                deposit(name);
            break;

            case 'transfer':
                transfer(name);
            break;

            case 'logout':
                logout(name);
            break;

            default:
                main(name);
            break;
        }

    });
}

const deposit = (name) => {
    inquirer.prompt(depositPrompt).then((answers) => {

        console.log(answers);
        main(name);

    });
}

const transfer = (name) => {
    inquirer.prompt(transferPrompt).then((answers) => {

        console.log(answers);
        main(name);

    });
}

const logout = (name) => {
    console.log(`good bye ${name} !`);
}

runCLI();