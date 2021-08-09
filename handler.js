const { glob } = require('glob');
const { promisify } = require('util');
const { Client } = require('discord.js');

const { debug } = require('./config.json');

const globPromise = promisify(glob);

module.exports = async client => {
	// Slash Commands
	const slashCommands = await globPromise(`${process.cwd()}/slash/*/*.js`);

	const array = [];

	slashCommands.map(value => {
		const file = require(value);

		if (!file?.name) return;

		client.slashCommands.set(file.name, file);

		array.push(file);
	});

	client.on('ready', async () => {
		if (debug == true) {
			await client.guilds.cache.get('873773620827131966').commands.set(array);
		} else {
			await client.application.commands.set(array);
		}
	});
};
