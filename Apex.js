const Cluster = require('discord-hybrid-sharding');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Collection } = require('discord.js');

let { debug, token } = require('./config.json');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
	shards: Cluster.data.SHARD_LIST,
	shardCount: Cluster.data.TOTAL_SHARDS,
});

const commandFiles = fs.readdirSync('./slash').filter(file => file.endsWith('.js'));

const commands = [];

client.commands = new Collection();

for (const file of commandFiles) {
	const command = require(`./slash/${file}`);

	commands.push(command.data.toJSON());

	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Apex Stats: Online');

	const CLIENT_ID = client.user.id;

	const rest = new REST({
		version: '9',
	}).setToken(token);

	(async () => {
		try {
			if (debug == false) {
				await rest.put(Routes.applicationCommands(CLIENT_ID), {
					body: commands,
				});

				console.log('Registered commands globally.');
			} else {
				await rest.put(Routes.applicationGuildCommands(CLIENT_ID, '893227807667273738'), {
					body: commands,
				});

				console.log('Registered commands locally.');
			}
		} catch (err) {
			if (err) console.log(err);
		}
	})();
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(client, interaction);
	} catch (err) {
		if (err) console.log(err);

		await interaction.reply({ content: 'An error occured.', ephemeral: true });
	}
});

client.cluster = new Cluster.Client(client, true);
client.login(token);
