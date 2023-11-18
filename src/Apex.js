const chalk = require('chalk');
const { Client, GatewayIntentBits } = require('discord.js');

const { loadEvents } = require('./Events.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client
	.login(process.env.DISCORD_TOKEN)
	.then(() => {
		loadEvents(client);
	})
	.catch(error => {
		console.log(chalk.red(`${chalk.bold('[BOT]')} Error during login: ${error}`));
	});

setInterval(() => {
	const { uptime } = require('./utilities/misc.js');

	let uptimeLength = Math.floor(process.uptime());
	console.log(chalk.blue(`${chalk.bold('[BOT]')} ${uptime(uptimeLength)}`));
}, 60000);

module.exports = { client };
