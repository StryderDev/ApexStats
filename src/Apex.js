const chalk = require('chalk');
const { Client, GatewayIntentBits } = require('discord.js');

const { loadEvents } = require('./Events.js');
const { uptime } = require('./utilities/misc.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client
	.login(process.env.DISCORD_TOKEN)
	.then(() => {
		loadEvents(client);
	})
	.catch(error => {
		console.log(chalk.red(`${chalk.bold('[BOT]')} Error during login: ${error}`));
	});

uptime(client);

module.exports = { client };
