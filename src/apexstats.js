const chalk = require('chalk');
const { uptime } = require('./utilities/misc.js');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.login(process.env.DISCORD_TOKEN).catch(err => {
	console.log(chalk.red(`${chalk.bold('[BOT]')} Error logging into Discord: ${err.statusText}`));
});

uptime(client);

module.exports = { client };
