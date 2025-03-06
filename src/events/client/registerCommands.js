const fs = require('fs');
const chalk = require('chalk');
const { REST } = require('@discordjs/rest');
const { Collection } = require('discord.js');
const wait = require('util').promisify(setTimeout);
const { Routes } = require('discord-api-types/v10');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		// Register Slash Commands
		const commands = [];
		const rest = new REST({ version: 10 }).setToken(process.env.DISCORD_TOKEN);
		const commandFolders = fs.readdirSync(`${__dirname}/../../commands`);

		console.log(chalk.yellow(`${chalk.bold('[BOT]')} Registering Slash Commands...`));

		client.commands = new Collection();

		for (const commandFolder of commandFolders) {
			const commandFiles = fs.readdirSync(`${__dirname}/../../commands/${commandFolder}`).filter(commandFile => commandFile.endsWith('.js'));

			for (const commandFile of commandFiles) {
				const command = require(`../../commands/${commandFolder}/${commandFile}`);

				commands.push(command.data.toJSON());
				client.commands.set(command.data.name, command);
			}
		}

		// Push slash commands to discord
		(async () => {
			if (process.env.DEBUG == 'false') {
				// If debug is disabled, assume production
				await rest.put(Routes.applicationCommands(client.user.id), { body: commands });

				console.log(chalk.green(`${chalk.bold('[BOT]')} Successfully registered global slash commands`));
			} else {
				// Assume development
				// console.log(chalk.red(`${chalk.bold('[BOT]')} Debug enabled, removing previous commands...`));

				// await wait(500);

				// await rest
				// 	.put(Routes.applicationGuildCommands(client.user.id, process.env.TEST_SERVER), { body: [] })
				// 	.then(console.log(chalk.yellow(`${chalk.bold('[BOT]')} Removed previous guild commands`)))
				// 	.catch(error => console.error(chalk.red(`${chalk.bold('[BOT]')} Error removing previous guild commands: ${error}`)));

				// await wait(500);

				// await rest
				// 	.put(Routes.applicationCommands(client.user.id), { body: [] })
				// 	.then(console.log(chalk.yellow(`${chalk.bold('[BOT]')} Removed previous global commands`)))
				// 	.catch(error => console.error(chalk.red(`${chalk.bold('[BOT]')} Error removing previous global commands: ${error}`)));

				// await wait(5000);

				// Register guild commands for test server
				await rest.put(Routes.applicationGuildCommands(client.user.id, process.env.TEST_SERVER), { body: commands });

				console.log(chalk.green(`${chalk.bold('[BOT]')} Successfully registered local slash commands`));
			}
		})();
	},
};
