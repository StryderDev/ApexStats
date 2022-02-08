const { Client, Intents, Collection } = require('discord.js');
const { debug, discord } = require('./config.json');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const fs = require('fs');
const chalk = require('chalk');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const commands = [];

client.commands = new Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	const CLIENT_ID = client.user.id;
	const rest = new REST({ version: '9' }).setToken(discord.token);

	console.log(chalk`{yellow [>> Logging in...]}`);
	console.log(chalk`{green [>> Logged in as ${client.user.username}. Ready!]}`);

	client.user.setPresence({ activities: [{ name: 'you play Apex Legends', type: 'WATCHING' }] }, { status: 'dnd' });

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
			console.log(
				`[>>> Bot Uptime: ${Math.floor(process.uptime() / (60 * 60))} Hours, ${Math.floor(
					(process.uptime() % (60 * 60)) / 60,
				)} Minutes, ${Math.floor(process.uptime() % 60)} Seconds]`,
			);

			now = new Date();
			var delay = 60000 - (now % 60000);
			setTimeout(loop, delay);
		})();
	}

	uptimeCount();
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (err) {
		if (err) console.error(err);

		await interaction.editReply({ content: 'An error has occured.', ephemeral: true, embeds: [] });
	}
});

client.login(discord.token);
