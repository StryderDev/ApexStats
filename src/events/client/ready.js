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
		// Set rotating bot presence
		(async function mapPrecenseLoop() {
			const date = new Date();
			let minutes = date.getMinutes();

			// Check and update every x minutes ('interval' in config)
			if (minutes % 5 == 0) {
				await wait(1000);

				axios.get(`https://api.jumpmaster.xyz/map/?key=${process.env.SPYGLASS}`).then(res => {
					const br = res.data.br;
					const ranked = res.data.ranked;

					// select brMapIndex and rankedMapIndex from currentMapIndex where
					// the ID is equal to the current shard ID + 1
					const mapIndex = db_mapIndex.prepare(`SELECT brMapIndex, rankedMapIndex FROM currentMapIndex WHERE id = ${client.shard.ids[0] + 1}`).get();

					if (mapIndex.brMapIndex != br['_index'] || mapIndex.rankedMapIndex != ranked['_index']) {
						console.log(chalk.yellow(`${chalk.bold('[PRESENCE]')} Checking for map rotation updates...`));

						client.user.setActivity(`${br.map.name} / ${ranked.map.name}`, { type: ActivityType.Custom });

						console.log(chalk.blue(`${chalk.bold('[PRESENCE]')} Map rotation updates found, updated presence to "${br.map.name} / ${ranked.map.name}"`));

						// Update the mapIndex table with the new map indexes
						db_mapIndex
							.prepare(`INSERT OR REPLACE INTO currentMapIndex (id, brMapIndex, rankedMapIndex) VALUES (?, ?, ?)`)
							.run((client.shard.ids[0] + 1).toString(), br['_index'], ranked['_index']);
					}
				});
			}

			var delay = 60000 - (date % 60000);
			setTimeout(mapPrecenseLoop, delay);
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
