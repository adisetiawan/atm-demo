const { prompt } = require('enquirer');

const { get, post } = require('httpie');

//const main = require('./main');

const login = async () => {
    const commandResp =  await prompt([
          {
            type: 'input',
            name: 'username',
            message: 'enter your username',
          },
          {
            type: 'password',
            name: 'pin',
            message: 'enter your 4 digit pin (default 1234)',
          }]);

      const serverResp = await get('http://localhost:3000');

      if(true) {
        //console.log(serverResp.data)
        return commandResp;
      }

    
}

module.exports = login;