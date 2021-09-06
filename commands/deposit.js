const { prompt } = require('enquirer');

const deposit = async () => {
  return await prompt([
        {
          type: 'number',
          name: 'amount',
          message: 'enter amount',
        }]);
}

module.exports = deposit;