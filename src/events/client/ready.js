const fs = require('fs');
const axios = require('axios');
const { REST } = require('@discordjs/rest');
const { Collection, ActivityType } = require('discord.js');
const wait = require('util').promisify(setTimeout);
const { Routes } = require('discord-api-types/v10');

function uptime() {
	(function loop() {
		const uptime = process.uptime();
		const seconds = `${Math.floor(uptime % 60)} Seconds`;
		const minutes = `${Math.floor((uptime % (60 * 60)) / 60)} Minutes`;
		const hours = `${Math.floor((uptime / (60 * 60)) % 24)} Hours`;
		const days = `${Math.floor(uptime / 86400)} Days`;

		console.log(`Bot Uptime: ${days}, ${hours}, ${minutes}, ${seconds}`);

		now = new Date();
		var delay = 60000 - (now % 60000);
		setTimeout(loop, delay);
	})();
}

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		// Set rotating bot presence
		(async function mapPrecenseLoop() {
			const date = new Date();
			let minutes = date.getMinutes();

			// Check and update every x minutes ('interval' in config)
			if (minutes % 1 == 0) {
				await wait(1000);

				axios.get(`https://api.jumpmaster.xyz/map/?key=${process.env.SPYGLASS}`).then(res => {
					const br = res.data.br.map.name;
					const ranked = res.data.ranked.map.name;
					const mixtape = res.data.mixtape.map;

					client.user.setActivity(`BR: ${br} / Ranked: ${ranked}`, { type: ActivityType.Custom });

					console.log(`[>> Updated Presence Map to "BR: ${br} / Ranked: ${ranked}" <<]`);
				});
			}

			var delay = 60000 - (date % 60000);
			setTimeout(mapPrecenseLoop, delay);
			console.log('Checking for presence updates...');
		})();

		// Display bot uptime in console
		uptime();

		// Register slash commands
		const commands = [];
		const clientID = client.user.id;
		const rest = new REST({ version: 10 }).setToken(process.env.DISCORD_TOKEN);
		const folders = fs.readdirSync(`${__dirname}/../../commands`);

		client.commands = new Collection();

		for (const folder of folders) {
			const files = fs.readdirSync(`${__dirname}/../../commands/${folder}`).filter(file => file.endsWith('.js'));

			for (const file of files) {
				const command = require(`../../commands/${folder}/${file}`);

				commands.push(command.data.toJSON());
				client.commands.set(command.data.name, command);
			}
		}

		// Push the commands to Discord
		(async () => {
			try {
				if (process.env.DEBUG == 'false') {
					// If debug is disabled, assume production
					// bot and register global slash commands
					await rest.put(Routes.applicationCommands(clientID), { body: commands });

					console.log(`[>> Successfully registered global slash commands <<]`);
				} else {
					// // Delete all guild-base commands
					// await rest
					// 	.put(Routes.applicationGuildCommands(clientID, discord.devGuild), { body: [] })
					// 	.then(() => console.log('Successfully deleted all guild commands.'))
					// 	.catch(console.error);

					// // Delete all global commands
					// await rest
					// 	.put(Routes.applicationCommands(clientID), { body: [] })
					// 	.then(() => console.log('Successfully deleted all application commands.'))
					// 	.catch(console.error);

					// If debug is enabled, assume dev environment
					// and only register slash commands for dev build
					await rest.put(Routes.applicationGuildCommands(clientID, process.env.DEVGUILD), { body: commands });

					console.log(`[>> Successfully registered local slash commands <<]`);
				}
			} catch (error) {
				if (error) console.log(error);
			}
		})();
	},
};
