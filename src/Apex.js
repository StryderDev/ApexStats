const { Client, Intents, Collection, MessageEmbed } = require('discord.js');
const { debug, discord } = require('./config.json');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { getSeasonEmbed } = require('./slash/info/functions/getSeasonEmbed.js');
const axios = require('axios');

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const commandFolders = fs.readdirSync(path.join(__dirname, '/slash'));

const commands = [];

client.commands = new Collection();

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(path.join(__dirname, `/slash/${folder}`)).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(path.join(__dirname, `/slash/${folder}/${file}`));

		commands.push(command.data.toJSON());
		client.commands.set(command.data.name, command);
	}
}

client.once('ready', () => {
	const CLIENT_ID = client.user.id;
	const rest = new REST({ version: '9' }).setToken(discord.token);

	console.log(chalk`{yellow [>> Logging in...]}`);
	console.log(chalk`{green [>> Logged in as ${client.user.username}. Ready!]}`);

	client.user.setPresence({ activities: [{ name: 'you play Apex Legends', type: 'WATCHING' }] }, { status: 'online' });

	(async () => {
		try {
			if (debug.true == false) {
				await rest.put(Routes.applicationCommands(CLIENT_ID), {
					body: commands,
				});

				console.log(chalk`{blue.bold [>> Successfully registered global slash commands]}`);
			} else {
				await rest.put(Routes.applicationGuildCommands(CLIENT_ID, debug.guild), {
					body: commands,
				});

				console.log(chalk`{blue.bold [>> Successfully registered local slash commands]}`);
			}
		} catch (error) {
			if (error) console.log(error);
		}
	})();

	async function uptimeCount() {
		(function loop() {
			const uptime = process.uptime();
			const seconds = Math.floor(uptime % 60);
			const minutes = Math.floor((uptime % (60 * 60)) / 60);
			const hours = Math.floor(uptime / (60 * 60));
			const days = Math.floor(uptime / 86400);

			console.log(`[>>> Shard #${client.shard.ids[0] + 1} Uptime: ${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds]`);

			now = new Date();
			var delay = 60000 - (now % 60000);
			setTimeout(loop, delay);
		})();
	}

	uptimeCount();
});

client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {
		await interaction.deferReply();

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
			console.log(`[>>>> Command ran: /${interaction.commandName}]`);
		} catch (err) {
			if (err) console.error(err);

			await interaction.editReply({ content: 'An error has occured.', embeds: [] });
		}
	}
	if (interaction.isSelectMenu()) {
		if (interaction.customId == 'seasonInfo') {
			await interaction.deferUpdate();

			const seasonEmbed = await getSeasonEmbed(interaction.values[0]);

			interaction.editReply({
				embeds: [seasonEmbed],
				components: [],
			});
		}
	} else {
		return;
	}
});

client.login(discord.token);
