const { Client, Collection } = require('discord.js');
const chalk = require('chalk');
const { REST } = require('@discordjs/rest');
const { discord, debug } = require('../../config.json');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');

const commandFolders = fs.readdirSync('./src/slash');

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
			const commandFiles = fs.readdirSync(`./src/slash/${folder}`).filter(file => file.endsWith('.js'));

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

		async function uptime() {
			(function loop() {
				const uptime = process.uptime();
				const seconds = Math.floor(uptime % 60);
				const minutes = Math.floor((uptime % (60 * 60)) / 60);
				const hours = Math.floor(uptime / (60 * 60));
				const days = Math.floor(uptime / 86400);

				console.log(chalk`{blue [>>> Shard #${client.shard.ids[0] + 1} Uptime: ${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds]}`);

				now = new Date();
				var delay = 60000 - (now % 60000);
				setTimeout(loop, delay);
			})();
		}

		uptime();
	},
};
