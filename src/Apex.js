const { Client, GatewayIntentBits, Partials } = require('discord.js');

const { Guilds } = GatewayIntentBits;
const {} = Partials;

const { discord } = require('./config.json');

const client = new Client({ intents: [Guilds] });

const { loadEvents } = require('./handlers/events.js');

client
	.login(discord.token)
	.then(() => {
		loadEvents(client);
	})
	.catch(err => console.log(err));

module.exports = { client };
