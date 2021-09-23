const { get, post } = require("httpie");

const api = {
	login: async (data) => {
		try {
			const res = await post("http://localhost:3000/login", {
				body: {
					name: data.name,
					password: data.password,
				},
			});

			return res.data;
		} catch (err) {
			console.error("Error!", err.statusCode, err.message);
			console.error("~> headers:", err.headers);
			console.error("~> data:", err.data);
		}
	},

	deposit: async (data) => {
		try {
			const res = await post("http://localhost:3000/deposit", {
				body: {
					name: data.name,
					amount: data.amount,
				},
			});

			return res.data;
		} catch (err) {
			console.error("Error!", err.statusCode, err.message);
			console.error("~> headers:", err.headers);
			console.error("~> data:", err.data);
		}
	},

	transfer: async (data) => {
		try {
			const res = await post("http://localhost:3000/transfer", {
				body: {
					name: data.name,
					destination: data.destination,
					amount: data.amount,
				},
			});

			return res.data;
		} catch (err) {
			console.error("Error!", err.statusCode, err.message);
			console.error("~> headers:", err.headers);
			console.error("~> data:", err.data);
		}
	},
};

module.exports = api;
