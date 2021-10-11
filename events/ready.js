const client = require('../Apex.js');
const { WebhookClient } = require('discord.js');
const chalk = require('chalk');
const { DateTime } = require('luxon');

const { updateMap } = require('../functions/updates.js');

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

	async function embedUpdate() {
		(function loop() {
			const timeLoop = DateTime.local().toFormat('hh:mm:ss');

			var now = new Date();
			if (now.getMinutes() === 15) {
				updateMap();
			}

			now = new Date();
			var delay = 60000 - (now % 60000);
			setTimeout(loop, delay);
			console.log(chalk`{yellow.bold [${timeLoop}] Checking...}`);
		})();
	}

	embedUpdate();
	console.log(chalk`{blue.bold [${timeLogs}] Starting Embed Update Function...}`);
});
