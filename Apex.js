const { Client, Intents, Collection } = require('discord.js');
const chalk = require('chalk');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
module.exports = client;

// Global Variables
client.slashCommands = new Collection();
client.config = require('./config.json');

// Initializing the project
require('./handler/handler.js')(client);

process.on('unhandledRejection', (reason, promise) => {
	console.log(chalk`{red.bold [FATAL] Possible Unhandled Rejection Error. Reason: ${reason.message}.}`);
});

client.login(client.config.discord.token);
