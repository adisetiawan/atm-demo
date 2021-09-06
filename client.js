const figlet = require('figlet');
const { prompt } = require('enquirer');

const header = figlet.textSync('Demo  ATM', {
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
});

const commands = ['login', 'deposit', 'transfer', 'logout'];

console.log(header);

const main = require('./commands/main');
const login = require('./commands/login');
const deposit = require('./commands/deposit');
const transfer = require('./commands/transfer');
const logout = require('./commands/logout');

prompt(main)
  .then((answers) => {
      
      switch(answers.atmcommand) {
        
        case 'login':
            login();
            
        break;

        case 'deposit':
            
            deposit();
        break;

        case 'transfer':
            
            transfer();
        break;

        case 'logout':
            
            logout();
        break;
    }

  })
  .catch(console.error);


// (async () => {

//     const respCommand = await prompt({
//       type: 'select',
//       name: 'atmcommand',
//       message: 'Select available ATM Command:',
//       choices: commands
//     });

//     switch(respCommand.atmcommand) {
//         case 'login':
//             const login = require('./commands/login');
//             login();
            
//         break;

//         case 'deposit':
//             const deposit = require('./commands/deposit');
//             deposit();
//         break;

//         case 'transfer':
//             const transfer = require('./commands/transfer');
//             transfer();
//         break;

//         case 'logout':
//             const logout = require('./commands/logout');
//             logout();
//         break;
//     }

// })();