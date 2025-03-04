const chalk = require('chalk');
const { InteractionType } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, client) {
		if (!interaction.isCommand()) return;

		if (interaction.type === InteractionType.ApplicationCommand) {
			await interaction.deferReply();

			const command = client.commands.get(interaction.commandName);

			try {
				await command.execute(interaction);

				console.log(chalk.cyan(`${chalk.bold('[INTERACTION]')} ${interaction.user.username} used /${interaction.commandName}`));
			} catch (err) {
				console.error(chalk.red(`${chalk.bold('[INTERACTION]')} Interaction Error: ${err}`));
			}
		}
	},
};
