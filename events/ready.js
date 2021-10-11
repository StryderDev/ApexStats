const client = require('../Apex.js');
const { WebhookClient } = require('discord.js');
const chalk = require('chalk');
const { DateTime } = require('luxon');

const { updateBotStatus } = require('../functions/botStatusUpdate.js');
const { updateMap } = require('../functions/mapUpdate.js');
const { updateStatus } = require('../functions/statusUpdate.js');
const { config } = require('../Apex.js');

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

	client.user.setPresence({
		status: 'dnd',
		activities: [{ name: 'Titanfall Approaching Battlefield', type: 'WATCHING' }],
	});

	async function embedUpdate() {
		(function loop() {
			const timeLoop = DateTime.local().toFormat('hh:mm:ss');

			var now = new Date();

			if (config.debug == true) {
				if (now.getMinutes() === now.getMinutes()) {
					updateBotStatus();

					updateMap();
					updateStatus();
				}
			} else {
				if (
					now.getMinutes() == 0 ||
					now.getMinutes() == 5 ||
					now.getMinutes() == 10 ||
					now.getMinutes() == 15 ||
					now.getMinutes() == 20 ||
					now.getMinutes() == 20 ||
					now.getMinutes() == 30 ||
					now.getMinutes() == 35 ||
					now.getMinutes() == 40 ||
					now.getMinutes() == 45 ||
					now.getMinutes() == 50 ||
					now.getMinutes() == 55
				) {
					updateBotStatus();

					updateMap();
					updateStatus();
				}
			}

			now = new Date();
			var delay = 60000 - (now % 60000);
			setTimeout(loop, delay + 1000);
			console.log(chalk`{yellow.bold [${timeLoop}] Checking...}`);
		})();
	}

	embedUpdate();
	console.log(chalk`{blue.bold [${timeLogs}] Starting Embed Update Function...}`);
});
