const { prompt } = require('enquirer');

const transfer = async () => {
  return await prompt([
  		{
          type: 'input',
          name: 'destination',
          message: 'enter destination username',
        },
        {
          type: 'number',
          name: 'amount',
          message: 'enter amount',
        }]);
}

module.exports = transfer;