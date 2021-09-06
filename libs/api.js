import fetch from 'node-fetch';

const api = {
	login: async () => {
		const response = await fetch('https://api.github.com/users/github');
		const data = await response.json();
		return data;
	},

	deposit: async () => {
		
	},

	transfer: async () => {

	},

	logout: async () => {

	},

}

module.exports = api;
