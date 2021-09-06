const commands = ['login', 'deposit', 'transfer', 'logout'];

module.exports = [
  {
      type: 'select',
      name: 'atmcommand',
      message: 'Select available ATM Command:',
      choices: commands
  }
];