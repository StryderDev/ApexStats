const { Client, GatewayIntentBits } = require('discord.js');

const { discord } = require('./config.json');
const { loadEvents } = require('./Events.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client
	.login(discord.token)
	.then(() => {
		loadEvents(client);
	})
	.catch(error => {
		console.log(`Error loading bot during login: ${error}`);
	});

module.exports = { client };
