const { Client, Intents, Collection } = require('discord.js');

const { loadSlashCommands } = require('./handler/loadSlashCommands.js');
const { loadEvents } = require('./handler/loadEvents.js');
const { discord } = require('./config.json');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.slash = new Collection();

loadEvents(client);
loadSlashCommands(client);

process.on('uncaughtException', err => {
	console.log(`Uncaught Exception: ${err}`);
});

process.on('unhandledRejection', (reason, promise) => {
	console.log(`[FATAL] Possible Unhandled Rejection error at: Promise ${promise}, reason: ${reason.message}`);
});

client.login(discord.token);
