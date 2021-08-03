const { glob } = require('glob');
const { promisify } = require('util');

const globPromise = promisify(glob);

module.exports = async client => {
	// Commands
	const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
	commandFiles.map(value => {
		const file = require(value);
		const split = value.split('/');
		const directory = split[split.length - 2];

		if (file.name) {
			const properties = { directory, ...file };
			client.commands.set(file.name, properties);
		}
	});

	// Events
	const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
	eventFiles.map(value => require(value));

	// Slash Commands
	const slashCommands = await globPromise(`${process.cwd()}/SlashCommands/*/*.js`);
	const arrayOfSlashCommands = [];

	slashCommands.map(value => {
		const file = require(value);
		if (!file?.name) return;

		client.slashCommands.set(file.name, file);
		arrayOfSlashCommands.push(file);
	});

	client.on('ready', () => {
		if (client.config.debug == true) {
			client.guilds.cache.get('664717517666910220').commands.set(arrayOfSlashCommands);
		} else {
			client.application?.commands.set(arrayOfSlashCommands);
		}
	});
};
