const inquirer = require('inquirer');

module.exports = {
  type: 'list',
  name: 'mainmenu',
  message: 'Select available ATM Command',
  choices: ['deposit', 'transfer', new inquirer.Separator(), 'logout'],
};