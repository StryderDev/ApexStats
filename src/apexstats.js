const chalk = require('chalk');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.login(process.env.DISCORD_TOKEN).catch(err => {
	console.log(chalk.red(`${chalk.bold('[BOT]')} Error logging into Discord: ${err.statusText}`));
});
