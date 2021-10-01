const client = require('../index.js');
const { WebhookClient } = require('discord.js');
const chalk = require('chalk');
const { DateTime } = require('luxon');

client.on('ready', () => {
	const time = new Date().getTime();
	const timeLogs = DateTime.local().toFormat('hh:mm:ss');

	// Log the bot logging ing
	console.log(chalk`{yellow [${timeLogs}] Logging in...}`);
	console.log(chalk`{green [${timeLogs}] Logged in as ${client.user.username}}`);

	// Send a webhook that the bot has logged in
	const webhookClient = new WebhookClient({
		url: client.config.logs.ready,
	});

	webhookClient.send({
		content: `<t:${Math.floor(time / 1000)}:R> :white_check_mark: Bot Ready`,
	});
});
