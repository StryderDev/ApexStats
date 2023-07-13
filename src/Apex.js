const { Client, GatewayIntentBits } = require('discord.js');

const { loadEvents } = require('./Events.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client
	.login(process.env.DISCORD_TOKEN)
	.then(() => {
		loadEvents(client);
	})
	.catch(error => {
		console.log(`Error loading bot during login: ${error}`);
	});

module.exports = { client };
