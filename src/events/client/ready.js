const fs = require('fs');
const axios = require('axios');
const chalk = require('chalk');
const Database = require('better-sqlite3');
const { REST } = require('@discordjs/rest');
const wait = require('util').promisify(setTimeout);
const { Routes } = require('discord-api-types/v10');
const { Collection, ActivityType } = require('discord.js');

const db_mapIndex = new Database(`${__dirname}/../../databases/mapIndex.sqlite`);

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		// Set Map Rotation in Bot Presence
		(async function mapPresenceLoop() {
			const currentMinute = new Date().getMinutes();

			if (currentMinute % 5 == 0) {
				await wait(1000);

				const brMap = axios.get(`https://solaris.apexstats.dev/beacon/map/br?key=${process.env.SPYGLASS}`);
				const rankedMap = axios.get(`https://solaris.apexstats.dev/beacon/map/ranked?key=${process.env.SPYGLASS}`);

				await axios
					.all([brMap, rankedMap])
					.then(
						axios.spread((...res) => {
							// Grabbing the data from the axios requests
							const brMap = res[0].data;
							const rankedMap = res[1].data;

							const mapIndex = db_mapIndex.prepare(`SELECT brMapIndex, rankedMapIndex FROM currentMapIndex WHERE id = ${client.shard.ids[0] + 1}`).get();

							if (mapIndex.brMapIndex != brMap['rotationIndex'] || mapIndex.rankedMapIndex != rankedMap['rotationIndex']) {
								console.log(chalk.yellow(`${chalk.bold('[PRESENCE] Checking for map rotation updates...')}`));

								client.user.setActivity(`${brMap['map']['name']} / ${rankedMap['map']['name']}`, { type: ActivityType.Custom });

								console.log(chalk.blue(`${chalk.bold('[PRESENCE]')} Map rotation updates found, updated presence to "${brMap['map']['name']} / ${rankedMap['map']['name']}"`));

								db_mapIndex.prepare(`UPDATE currentMapIndex SET brMapIndex = ${brMap['rotationIndex']}, rankedMapIndex = ${rankedMap['rotationIndex']} WHERE id = ${client.shard.ids[0] + 1}`).run();
							}
						}),
					)
					.catch(error => {
						if (error.response) {
							console.log(chalk.yellow(`${chalk.bold('[MAP LOOKUP ERROR]')} ${error.response.data.errorShort}`));
						} else if (error.request) {
							console.log(error.request);
						} else {
							console.log(error.message);
						}
					});
			}

			var delay = 60000 - new Date().getSeconds() * 1000;
			setTimeout(mapPresenceLoop, delay);
		})();

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
			if (process.env.DEBUG == 'false') {
				// If debug is disabled, assume production
				// bot and register global slash commands
				await rest.put(Routes.applicationCommands(clientID), { body: commands });

				console.log(chalk.green(`${chalk.bold('[BOT]')} Successfully registered global slash commands`));
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

				console.log(chalk.yellow(`${chalk.bold('[BOT]')} Successfully registered local slash commands`));
			}
		})();
	},
};
