module.exports = [
  {
    type: 'input',
    name: 'destination',
    message: 'enter destination username',
  },
  {
    type: 'input',
    name: 'amount',
    message: 'enter amount',
    validate(value) {
      const valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
  }
];