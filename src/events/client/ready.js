const { Client, Collection, ActivityType } = require('discord.js');
const chalk = require('chalk');
const { REST } = require('@discordjs/rest');
const { discord, debug, api } = require('../../config.json');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');
const { uptime } = require('../../functions/uptime.js');
const axios = require('axios');
const wait = require('util').promisify(setTimeout);

const commandFolders = fs.readdirSync(__dirname + '/../../slash');

const commands = [];

module.exports = {
	name: 'ready',
	once: true,
	/**
	 *
	 * @param {Client} client
	 */
	execute(client) {
		client.commands = new Collection();

		for (const folder of commandFolders) {
			const commandFiles = fs.readdirSync(__dirname + `/../../slash/${folder}`).filter(file => file.endsWith('.js'));

			for (const file of commandFiles) {
				const command = require(`../../slash/${folder}/${file}`);

				commands.push(command.data.toJSON());
				client.commands.set(command.data.name, command);
			}
		}

		const clientID = client.user.id;
		const rest = new REST({ version: '10' }).setToken(discord.token);

		console.log(chalk`{yellow [>> Logging in...]}`);
		console.log(chalk`{green [>> Logged in as ${client.user.username}. Ready!]}`);

		(async () => {
			try {
				if (debug.true == false) {
					await rest.put(Routes.applicationCommands(clientID), { body: commands });

					console.log(chalk`{blue.bold [>> Successfully registered global slash commands]}`);
				} else {
					await rest.put(Routes.applicationGuildCommands(clientID, debug.guild), { body: commands });

					console.log(chalk`{blue.bold [>> Successfully registered local slash commands]}`);
				}
			} catch (error) {
				if (error) console.log(error);
			}
		})();

		// Count Uptime in Console
		uptime();

		// Rotating Map Presence
		(async function presenceLoop() {
			const date = new Date();
			let minutes = date.getMinutes();

			if (minutes % 5 == 0) {
				await wait(1000);

				axios.get(`https://api.mozambiquehe.re/maprotation?auth=${api.apex}&version=2`).then(function (res) {
					const data = res.data.battle_royale.current.map;

					client.user.setPresence({ activities: [{ name: `on ${data}` }], status: 'online' });
					console.log(chalk`{cyan.bold [>>>> Updated bot presence. Set to "Playing on ${data}"]}`);
				});
			}

			var delay = 60000 - (date % 60000);
			setTimeout(presenceLoop, delay);
			// console.log('Checking for Presence');
		})();
	},
};
