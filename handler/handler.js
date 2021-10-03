const { glob } = require('glob');
const { promisify } = require('util');
const { Client } = require('discord.js');

const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async client => {
	// Commands
	const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
	commandFiles.map(value => {
		const file = require(value);
		const splitted = value.split('/');
		const directory = splitted[splitted.length - 2];

		if (file.name) {
			const properties = { directory, ...file };
			client.commands.set(file.name, properties);
		}
	});

	// Events
	const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
	eventFiles.map(value => require(value));

	// Slash Commands
	const slashCommands = await globPromise(`${process.cwd()}/slash/*/*.js`);

	const arrayOfSlashCommands = [];
	slashCommands.map(value => {
		const file = require(value);
		if (!file?.name) return;
		client.slashCommands.set(file.name, file);

		if (['MESSAGE', 'USER'].includes(file.type)) delete file.description;
		arrayOfSlashCommands.push(file);
	});
	client.on('ready', async () => {
		const id = '893227807667273738';
		const guild = client.guilds.cache.get(id);

		if (guild) {
			// If the guild exists in the cache (which it shouldn't, the dev bot is the
			//  only one in the guild with that ID), then register commands in that guild
			commands = guild.commands.set(arrayOfSlashCommands);
		} else {
			// Globally register all the commands
			commands = client.application?.commands.set(arrayOfSlashCommands);
		}
	});
};
